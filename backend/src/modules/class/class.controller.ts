 import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  BadRequestException,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  async create(@Body() createClassDto: CreateClassDto) {
    return this.classService.create(createClassDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.classService.findById(id);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('course') course?: string,
    @Query('instructor') instructor?: string,
    @Query('schedule') schedule?: string,
    @Query('location') location?: string,
  ) {
    // Build filter object dynamically
    const filter: any = {};
    if (course) filter.course = course;
    if (instructor) filter.instructor = instructor;
    if (schedule) filter.schedule = schedule;
    if (location) filter.location = location;

    // Validate sortOrder
    if (sortOrder && !['asc', 'desc'].includes(sortOrder)) {
      throw new BadRequestException('sortOrder must be "asc" or "desc"');
    }

    const options = { page, limit, sortBy, sortOrder };
    return this.classService.findAll(filter, options);
  }

  @Get('student/:studentId')
  async findByStudent(@Param('studentId') studentId: string) {
    return this.classService.findByStudent(studentId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateClassDto: UpdateClassDto) {
    return this.classService.update(id, updateClassDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.classService.delete(id);
    return { message: `Class with id ${id} deleted successfully` };
  }

  @Post(':id/students')
  async addStudent(@Param('id') classId: string, @Body('studentId') studentId: string) {
    return this.classService.addStudent(classId, studentId);
  }

  @Delete(':id/students/:studentId')
  async removeStudent(@Param('id') classId: string, @Param('studentId') studentId: string) {
    return this.classService.removeStudent(classId, studentId);
  }
}