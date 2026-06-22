import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { StudentsService } from './student.service';
import { CreateStudentDto } from './dto/student.dto';
import { UpdateStudentDto } from './dto/student.dto'; 
import { AuthGuard } from '../auth/auth.guard';
import { ClassService } from '../class/class.service';

@UseGuards(AuthGuard)
@Controller('students')
export class StudentsController {
  constructor(
    private readonly studentsService: StudentsService,
  ) {}

  @Post()
  async create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.studentsService.findAll(page, limit);
  }

  @Get('me')
  async findMe(@Req() req: any) {
    console.log('students.service.me being called...');
    console.log('req.headers.authorization', req.headers.authorization);
    console.log('req.students', req.student);
    const userId =
      req.student?.sub ??
      req.student?.id ??
      req.student?._id ??
      req.student?.userId;

    if (!userId) {
      console.log('findMe req.student:', req.student);
      throw new BadRequestException('User ID not found in token');
    }
    console.log('before find by id service called');
    const s = await this.studentsService.findById(userId);
    console.log(s);
    return s;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    this.validateObjectId(id);
    return this.studentsService.findById(id);
  }

  @Get('me/classes')
  async findMyEnrolledClasses(@Req() req: any) {
    console.log('findMyEnrolledClasses called');

    const userId = req.student?.sub ?? 
                   req.student?.id ?? 
                   req.student?._id;

    if (!userId) {
        throw new BadRequestException('User ID not found in token');
    }
    const classes = await this.studentsService.findEnrolledClasses(userId);
    if(!classes) throw new NotFoundException("classes not found for userid:", userId);
    return classes;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string) {
    return this.studentsService.findByEmail(email);
  }

  @Get('course/:courseId')
  async findByCourse(@Param('courseId') courseId: string) {
    this.validateObjectId(courseId);
    return this.studentsService.findByCourse(courseId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateStudentDto: UpdateStudentDto,
  ) {
    this.validateObjectId(id);
    return this.studentsService.update(id, updateStudentDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    this.validateObjectId(id);
    await this.studentsService.remove(id);
  }

  @Put('soft-delete/:id')
  async softDelete(@Param('id') id: string) {
    this.validateObjectId(id);
    return this.studentsService.softDelete(id);
  }

  @Post('enroll')
  async enroll(@Req() req: any, @Body() body: { cid: string}) {
    const uid = req.student?.sub ?? 
                   req.student?.id ?? 
                   req.student?._id;

    if (!uid) {
        throw new BadRequestException('User ID not found in token');
    }
    console.log("were in the enroll controller")

    this.validateObjectId(uid);
    this.validateObjectId(body.cid);
    return this.studentsService.enrollInCourse(uid, body.cid);
  }

  @Delete(':id/unenroll/:courseId')
  async unenroll(@Param('id') id: string, @Param('courseId') courseId: string) {
    this.validateObjectId(id);
    this.validateObjectId(courseId);
    return this.studentsService.unenrollFromCourse(id, courseId);
  }

  // Utility method to validate MongoDB ObjectId format
  private validateObjectId(id: string) {
    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ID format');
    }
  }
}