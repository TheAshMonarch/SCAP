import{
    Injectable,
    NotFoundException,
    ConflictException,
    Inject
} from '@nestjs//common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from './class.schema';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';

interface ClassFilter{
        course?: string;
        professor?: string;
        schedule?: string;
        location?: string;
        time?: string;
        dateRange?: {
            from: Date;
            to: Date;
        };
    };
interface OptionsFilter{
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
@Injectable()
export class ClassService{
    constructor(
        @InjectModel(Class.name) private classModel: Model<ClassDocument>,
    ){}

    async create(createClassDto: CreateClassDto): Promise<Class>{
        const _class = new this.classModel({
            ...createClassDto,
            attendees: [],
        });
        return _class.save();
    }

    async findById(id: string): Promise<Class>{
        const _class = await this.classModel.findById(id)
            .populate('course')
            .populate('attendees')
            .exec();
        if(!_class) throw new NotFoundException(`class with id ${id} not found`);
        return _class;
    }

    async addStudent(cid: string, sid: string): Promise<Class>{
        const attendee = await this.classModel.findByIdAndUpdate(
            cid,
            { $addToSet: { attendees: sid }},
            { new: true }
        ).exec();
        if(!attendee) throw new ConflictException(`couldnt either find the class or update the class `);
        return attendee;
    }


    async findAll(filter: ClassFilter = {}, options: OptionsFilter = {} ): Promise<Class[]>{
        const{
            page = 1,
            limit = 10,
            sortBy = 'schedule',
            sortOrder = 'asc',
        } = options;

        const queryFilter: any = {};
        if(filter.course) queryFilter.course = filter.course;
        if(filter.schedule) queryFilter.schedule = { $regex: filter.schedule, $options: 'i'};
        if(filter.location) queryFilter.location = { $regex: filter.location, $options: 'i'};
        if(filter.dateRange){
            queryFilter.schedule = {
                $gte: filter.dateRange.from,
                $lte: filter.dateRange.to,
            };
        }

        const sortOptions: any = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        return this.classModel.find(queryFilter)
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('course')
            .populate('attendees')
            .exec();
    }

    async removeStudent(cid: string, sid: string): Promise<Class | null>{
        return this.classModel.findByIdAndUpdate(
            cid,
            { $pull: { attendees: sid }},
            { new: true }
        ).exec();
    }

    async update(cid: string, updateClassDto: UpdateClassDto): Promise<Class | null>{
        return this.classModel.findByIdAndUpdate(cid, updateClassDto, { new: true }).exec();
    }

    async delete(cid: string): Promise<void>{
        this.classModel.findByIdAndDelete(cid).exec();

    }
    async findByStudent(sid: string): Promise<Class[]>{
        return this.classModel.find({ attendees: sid })
            .populate('course')
            .populate('attendees')
            .exec();
    }
}

