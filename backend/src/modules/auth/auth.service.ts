import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config'; // 1. Import ConfigService
import { StudentsService } from '../student/student.service';
import * as bcrypt from 'bcrypt';
import { Student } from '../student/student.schema';

interface payload{
    sub: string;
    email: string;
    username: string;
}
@Injectable()
export class AuthService {
    constructor(
        private readonly studentsService: StudentsService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService, // 2. Inject ConfigService here
    ){}


    generateAccessToken(payload: payload) {
        // 3. Retrieve safely. If missing, throw a clear server error immediately.
        const secret = this.configService.get<string>('access_secret');
        if (!secret) {
            throw new InternalServerErrorException('Missing access_secret configuration');
        }

        return this.jwtService.sign(payload, {
            secret,
            expiresIn: '15m',
        });
    }

    generateRefreshToken(payload: payload){
        // 4. Retrieve safely for the refresh token too
        const secret = this.configService.get<string>('refresh_secret');
        if (!secret) {
            throw new InternalServerErrorException('Missing refresh_secret configuration');
        }

        return this.jwtService.sign(payload, {
            secret,
            expiresIn: '7d'
        });
    }

    async validateStudent(email: string, p: string): Promise<any>{
        console.log('Auth service.validateStudent email:', email);
        const student = await this.studentsService.findByEmail(email);

        if(!student) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(p, student.password);
        if(!isMatch) throw new UnauthorizedException('Invalid credentials');

        const studentDocument = student instanceof Object && 'toObject' in student ? (student as any).toObject() : student;
        const { password, ...studentObj } = studentDocument;
        return studentObj;
    }

    async login(student: any) {
        try {
            const payload = {
                sub: student._id?.toString(),
                email: student.email,
                username: student.username,
            };

            const accessToken = this.generateAccessToken(payload);
            const refreshToken = this.generateRefreshToken(payload);
            await this.studentsService.setCurrentRefreshToken(student._id, refreshToken);

            return {
                access_token: accessToken,
                refresh_token: refreshToken,
            };
        } catch (error: any) {
            console.error(' Error in AuthService.login:', error);
            throw error;
        }
    }
}
