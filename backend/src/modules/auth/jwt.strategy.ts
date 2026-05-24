import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { StudentsService } from '../student/student.service';
import { Types } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

interface uPayload{
    username?: string,
    email?: string,
    _id?: Types.ObjectId,
}
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(
        private readonly studentsService: StudentsService,
        private readonly configService: ConfigService,
    ){
        const secret = configService.get<string>('access_secret');

        if(!secret){
            throw new Error('access_secret is not defined!');
        }

        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret,
        });
    }

    async validate(payload: { username: string; email: string; sub: string}): Promise<uPayload>{
        
        try{
            const student = await this.studentsService.findById(payload.sub);

        if(!student) throw new UnauthorizedException('Student not found!');

        return{
            _id: student._id,
            email: student.email,
            username: student.username,
        };
    }catch(error){
        console.error('Error in JwtStrategy.validate:', error);
        throw new UnauthorizedException('Invalid token');
    }
}
}