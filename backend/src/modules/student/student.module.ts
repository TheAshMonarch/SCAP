import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose'
import { Student, StudentSchema } from './student.schema';
import { StudentsService } from './student.service';
import { StudentsController } from './student.controller';
import { CounterSchema } from './counter.schema';
import { AuthGuard } from '../auth/auth.guard';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Student.name, schema: StudentSchema },
            { name: 'Counter', schema: CounterSchema }
        ]),
    ],
    providers: [StudentsService, AuthGuard],
    controllers: [StudentsController],
    exports: [StudentsService],
})
export class StudentsModule {}
