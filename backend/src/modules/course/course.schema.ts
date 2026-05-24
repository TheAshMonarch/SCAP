import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import  mongoose, { Document, Types } from 'mongoose';

export type CourseDocument = Course & Document;
@Schema({
    collection: 'courses',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})
export class Course{

    _id!: Types.ObjectId;

    @Prop({ required: true })
    courseCode!: string

    @Prop({ required: true })
    courseTitle!: string

    @Prop({ required: true })
    faculty!: string;

    @Prop({ required: true, enum: [1,2,3] })
    credits!: number;

    @Prop({})
    description!: string;

}
export const CourseSchema = SchemaFactory.createForClass(Course);