// users/users.service.ts
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Student, StudentDocument } from './student.schema';
import { Class, ClassDocument } from '../class/class.schema';
import { CreateStudentDto, UpdateStudentDto } from './dto/student.dto';
import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<StudentDocument>,
  ) {}

    async create(createStudentDto: CreateStudentDto): Promise<Student> {
        const existingStudent = await this.studentModel.findOne({
            email: createStudentDto.email,
        });

        if(existingStudent){
            throw new ConflictException('Email already registered!');
        }
        
        const hashedPassword = await bcrypt.hash(createStudentDto.password, 10);

        const student = new this.studentModel({
            ...createStudentDto,
            password: hashedPassword,
        });

        return student.save();
    }

    async findAll(page = 1, limit = 10): Promise<Student[]> {
        const skip = (page - 1) * limit;

        return this.studentModel
            .find({ isActive: true })
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 })
            .populate('enrolledCourses')
            .exec();
    }

    async findByCourse(courseId: string): Promise<Student[]>{
        return this.studentModel
            .find({ courses: courseId })
            .populate('courses')
            .exec();
    }

    async findById(id: string): Promise<Student> {
        const student = await this.studentModel
            .findById(id)
            .select('-password, -refreshToken',)
            .populate('enrolledCourses')
            .exec();
        if(!student) throw new NotFoundException(`student with id ${id} not found`);

        return student;
    }

    async findByIdWithCourses(id: string): Promise<Student> {
        const student = await this.studentModel
            .findById(id)
            .populate('enrolledCourses')
            .select('-password')
            .exec();
        if (!student) throw new NotFoundException(`Student with id ${id} not found`);
        return student;
    }

    async findByEmail(email: string): Promise<Student>{
        const student = await this.studentModel
            .findOne({email})
            .select('+password')
            .exec();
        if(!student) throw new NotFoundException(`Student with email: ${email} not found`);
        return student;
    }

async findEnrolledClasses(studentId: string): Promise<Class[]> {
  return this.studentModel.aggregate([
      // 1. Find the specific student
      { $match: { _id: new Types.ObjectId(studentId) } },
      
      // 2. Flatten the enrolled courses array
      { $unwind: '$enrolledCourses' },

      // 3. Dynamic Lookup that handles both ObjectId and String formats
      {
          $lookup: {
              from: 'classes',
              let: { studentCourseId: '$enrolledCourses' }, // Pass down the student's course ObjectId
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $eq: ['$course', '$$studentCourseId'] },                     // Match if it's an ObjectId
                        { $eq: ['$course', { $toString: '$$studentCourseId' }] }       // Match if it's a String
                      ]
                    }
                  }
                }
              ],
              as: 'classes'
          }
      },
      
      // 4. Flatten the matched classes
      { $unwind: '$classes' },
      
      // 5. Promote the class to be the main document
      { $replaceRoot: { newRoot: '$classes' } },
      
      // 6. Second Dynamic Lookup to fetch Course Details (also handles mixed string/object formats)
      {
          $lookup: {
              from: 'courses',
              let: { classCourseId: '$course' }, // Could be a string or an object
              pipeline: [
                {
                  $match: {
                    $expr: {
                      $or: [
                        { $eq: ['$_id', '$$classCourseId'] },
                        { $eq: [{ $toString: '$_id' }, '$$classCourseId'] }
                      ]
                    }
                  }
                }
              ],
              as: 'course'
          }
      },
      
      // 7. Flatten the course array object
      { $unwind: { path: '$course', preserveNullAndEmptyArrays: true } }
  ]).exec();
}
    async update(id: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
        // If password is being updated, hash it
        if (updateStudentDto.password) {
        updateStudentDto.password = await bcrypt.hash(updateStudentDto.password, 10);
        }

        const student = await this.studentModel
        .findByIdAndUpdate(id, updateStudentDto, { new: true, runValidators: true })
        .select('-password')
        .exec();

        if (!student) {
        throw new NotFoundException(`student with ID ${id} not found`);
        }

        return student;
    }


    async remove(id: string): Promise<void> {
        const result = await this.studentModel.deleteOne({_id: id }).exec();

        if(result.deletedCount === 0){
            throw new NotFoundException(`Student with ID ${id} not founnd`);
        }
    }

    async softDelete(id: string): Promise<Student> {
        const student = await this.studentModel
            .findByIdAndUpdate(id, { isActive: false }, { new: true })
            .exec();

            if(!student){
                throw new NotFoundException(`User with ID ${id} not found`);
            }
            
            return student
        }

    async enrollInCourse(studentId: string, courseId: string): Promise<Student> {
        const student = await this.studentModel.findById(studentId);
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found`);
        }

        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // Simple fix for TypeScript error
        const enrolledCourses = Array.isArray(student.enrolledCourses) 
            ? student.enrolledCourses 
            : [];

        // Check if already enrolled
        if (!enrolledCourses.some(id => id.toString() === courseId)) {
            await this.studentModel.findByIdAndUpdate(
                studentId,
                { $addToSet: { enrolledCourses: courseObjectId } }
            );
        }

        // Return updated student
        return this.studentModel
            .findById(studentId)
            .populate('enrolledCourses') as Promise<Student>;
    }
    async unenrollFromCourse(studentId: string, courseId: string): Promise<Student> {
        const student = await this.studentModel.findById(studentId).exec();
        if (!student) {
            throw new NotFoundException(`Student with ID ${studentId} not found`);
        }

        student.enrolledCourses = Array.isArray(student.enrolledCourses) 
            ? student.enrolledCourses.filter(
                (c) => c.toString() !== courseId,
            ) 
            : [];
        await student.save();

        return student;
    }

async setCurrentRefreshToken(userId: string | Types.ObjectId, refreshToken: string) {
    try {
        // Correct way to hash
        const salt = await bcrypt.genSalt(10);
        const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

        await this.studentModel.findByIdAndUpdate(
            userId,
            { refreshToken: hashedRefreshToken },
            { new: true }
        );

        console.log(' Refresh token saved successfully');
    } catch (error) {
        console.error(' Error saving refresh token:', error);
        throw error;
    }
}

async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    try {
        const user = await this.studentModel.findById(userId);

        if (!user || !user.refreshToken) {
            return null;
        }

        // Compare the plain refreshToken with the hashed one stored in DB
        const isRefreshTokenMatching = await bcrypt.compare(
            refreshToken, 
            user.refreshToken
        );

        if (!isRefreshTokenMatching) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error verifying refresh token:', error);
        return null;
    }
}

async removeRefreshToken(userId: string) {
    try {
        await this.studentModel.findByIdAndUpdate(
            userId,
            { refreshToken: null },
            { new: true }
        );
        console.log(' Refresh token removed');
    } catch (error) {
        console.error('Error removing refresh token:', error);
    }
}
}