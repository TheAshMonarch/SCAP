import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Types } from 'mongoose';
import { Student } from '../student/student.schema';

export type ClassDocument = Class & Document;

@Schema({
    collection: 'classes',
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
})

export class Class{
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Course"})
    course?: mongoose.Types.ObjectId;

    @Prop({})
    professor!: string;

    @Prop({})
    schedule!: string;

    @Prop({})
    time!: string;

    @Prop({})
    date!: string;

    @Prop({})
    classDocuments!: string;

    @Prop({ type: String })
    venue!: string;

    @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId }]})
    attendees?: mongoose.Types.ObjectId[];

}
export const ClassSchema = SchemaFactory.createForClass(Class);
