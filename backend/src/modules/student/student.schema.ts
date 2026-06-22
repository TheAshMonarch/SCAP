import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types  } from 'mongoose';
import { Counter, CounterSchema } from './counter.schema';
import { Course } from '../course/course.schema'
import { Class } from '../class/class.schema'



// combine the schema class with mongoose document for type safety
export type StudentDocument = Student & Document;

export enum Level{
    L100 = 100,
    L200 = 200,
    L300 = 300,
    L400 = 400,
}

@Schema({
    //collection name (defaults to lowercase plural of class name)
    collection: 'students',

    timestamps: true,

    //include virtuals when converting to json
    toJSON: { virtuals: true },
    toObject: { virtuals: true},
})
export class Student {

    _id!: Types.ObjectId;

    @Prop({ unique: true })
    studentId?: number;

    @Prop({ required: [true, "Student email is required"], unique: true})
    email!: string;

    @Prop({ unique: true })
    regNo!: string;

    @Prop({ required: true, trim: true, maxlength: 50 })
    firstName!: string;

    @Prop({ required: true, trim: true, maxlength: 50 })
    lastName!: string;
    
    @Prop({ required: true, trim: true, maxlength: 20 })
    username!: string;

    @Prop({ required: true, unique: true })
    department!: string;

    @Prop({ required: true, unique: true })
    faculty!: string;

    @Prop({ required: true, unique: true })
    password!: string;

    @Prop({ type: String,
            enum: Object.values(Level),
            default: Level.L100,
            required: true
     })
    level!: Level;

    @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }])
    enrolledCourses!: Course[];

    @Prop({ required: true })
    semester!: string 

    @Prop({required: false, min: 0.0, max: 5.0, default: 0 })
    gpa!: number;

    @Prop({ default: null })
    refreshToken?: string;

    createdAt!: Date;
    updatedAt!: Date;
}

export const StudentSchema = SchemaFactory.createForClass(Student);

StudentSchema.pre('save', async function () {
    // 'this' refers to the Student document
    if (!this.isNew) return;

    try {
        // Use this.constructor.model to find the registered 'Counter' model
        const CounterModel = (this.constructor as any).model('Counter');
        
        const counter = await CounterModel.findOneAndUpdate(
            { id: 'studentId' }, // The identifier for students
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Map the sequence to your studentId
        this.studentId = counter.seq; 
    } catch (error) {
        throw error;
    }
});


StudentSchema.index({ username: 1 }, {unique: true });
StudentSchema.index({ createdAt: -1 });
StudentSchema.index({ firstName: 'text', email: 'text' }); // Text search index