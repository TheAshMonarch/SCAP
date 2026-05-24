import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentsModule } from './modules/student/student.module';
import { DatabaseModule } from './modules/database/database.module';
// import { CourseModule } from './modules/class/course/course.module';
import { ClassModule } from './modules/class/class.module';
import { ClassController } from './modules/class/class.controller'; 
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CourseModule } from './modules/course/course.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    AuthModule, StudentsModule, DatabaseModule, ClassModule, CourseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
