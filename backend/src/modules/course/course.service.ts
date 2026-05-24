import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './course.schema';
import { Class, ClassDocument } from '../class/class.schema';
import { CreateCourseDto, UpdateCourseDto } from './dto/course.dto';
import { Types } from 'mongoose';

@Injectable()
export class CourseService{
    constructor(
        @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    ){}

    async create(createCourseDto: CreateCourseDto): Promise<Course>{
        const existingCourse = await this.courseModel.findOne({
            courseCode: createCourseDto.courseCode,
        })
        if(existingCourse) throw new ConflictException('Course already exists');
        const course = new this.courseModel({ ...createCourseDto })
        return course.save();
    }

    async findById(id: string): Promise<Course>{
        const _ = await this.courseModel
            .findById(id)
            .select('-password')
            .exec();
        if(!_) throw new NotFoundException(`Course with id ${id} not found!`);
        return _;
    }

    async findAll(filter = {}, options = { page: 1, limit: 10 }): Promise<Course[]>{
        const { page, limit } = options;
        return this.courseModel
            .find(filter)
            .skip((page-1) * limit)
            .limit(limit)
            .exec();
    }

    async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course | null>{
        if(!Types.ObjectId.isValid(id)) throw new BadRequestException();
        const updated = this.courseModel.findByIdAndUpdate(id, updateCourseDto, { new: true }).exec();
        if(!updated) throw new NotFoundException();
        return updated;
    }

    async delete(id: string): Promise<void>{
        if(!Types.ObjectId.isValid(id)) throw new BadRequestException();
        const classesCount = await this.classModel.countDocuments({ course: id }).exec();
        if( classesCount > 0) throw new BadRequestException(`course has existing classes`);
        const result = this.courseModel.findByIdAndDelete(id).exec();
        if(!result) throw new NotFoundException();
    }
    
    async findClasses(courseId: string, filter = {}, options = { page: 1, limit: 10 }): Promise<Class[]>{
        if(!Types.ObjectId.isValid(courseId)) throw new BadRequestException();
        const { page, limit } = options;
        return this.classModel
            .find({ course: courseId })
            .skip((page-1)*10)
            .limit(limit)
            .exec();
    }

    async addClassToCourse(courseId: string, cid: string): Promise<void>{
        if(!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(courseId)) throw new BadRequestException();
        const classDoc = await this.classModel.findById(cid).exec();
        if(!classDoc) throw new NotFoundException();
        const coid = new Types.ObjectId(courseId)
        classDoc.course = coid;
        await classDoc.save();
    }

    async countClasses(courseId: string): Promise<number>{
        if(!Types.ObjectId.isValid(courseId)) throw new BadRequestException();
        return this.classModel.countDocuments({ course: courseId })
    }

    async removeClassFromCourse(courseId: string, cid: string): Promise<void>{
        if(!Types.ObjectId.isValid(cid) || !Types.ObjectId.isValid(courseId)) throw new BadRequestException();
        const classDoc = await this.classModel.findByIdAndDelete(cid).exec();
        if(!classDoc) throw new NotFoundException();
        //since class cannot exist without a course it would be pointless think about it
        //lets delete the class instead
        //if there is no course there cannot be a class

        // classDoc.course = null;
        // await classDoc.save
    }
}