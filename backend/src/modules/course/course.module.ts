import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './course.schema';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { Class } from '../class/class.schema';
import { ClassSchema } from '../class/class.schema';
import { StudentsModule } from '../student/student.module';
@Module({
    imports: [ MongooseModule.forFeature([
        { name: Course.name, schema: CourseSchema },
        { name: Class.name, schema: ClassSchema}
    ]), StudentsModule],
    providers: [ CourseService ],
    controllers: [ CourseController ],
    exports: [ CourseService ],
})
export class CourseModule{}