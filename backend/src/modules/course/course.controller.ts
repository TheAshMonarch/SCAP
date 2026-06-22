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
import { CourseService } from './course.service';
import { StudentsService } from '../student/student.service';
import { CreateCourseDto } from './dto/course.dto';
import { UpdateCourseDto } from './dto/course.dto';
import { Types } from 'mongoose';
import { AuthGuard } from '@nestjs/passport';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService, private readonly studentsService: StudentsService) {}

  @Post()
  async create(@Body() createCourseDto: CreateCourseDto) {
    return this.courseService.create(createCourseDto);
  }

  @Get()
  async find(){
    const c = await this.courseService.findAll();
    return c;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.courseService.findById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.courseService.delete(id);
  }

  // Get classes of a course with pagination
  @Get(':id/classes')
  async findClasses(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.courseService.findClasses(id, {}, { page, limit });
  }

  // Count classes of a course
  @Get(':id/classes/count')
  async countClasses(@Param('id') id: string) {
    return this.courseService.countClasses(id);
  }

  // Optional: Add a class to a course
  @Post(':id/classes/:classId')
  async addClassToCourse(@Param('id') courseId: string, @Param('classId') classId: string) {
    await this.courseService.addClassToCourse(courseId,classId);
    return { message: 'Class added to course' };
  }

  // Optional: Remove a class from a course (deletes the class)
  @Delete(':id/classes/:classId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeClassFromCourse(@Param('id') courseId: string, @Param('classId') classId: string) {
    await this.courseService.removeClassFromCourse(courseId, classId);
  }
}