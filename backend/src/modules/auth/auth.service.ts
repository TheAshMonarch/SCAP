import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentsService } from '../student/student.service';
import * as bcrypt from 'bcrypt';
import { Student } from '../student/student.schema';

@Injectable()
export class AuthService{
    constructor(
        private readonly studentsService: StudentsService,
        private readonly jwtService: JwtService,
    ){}

    generateAccessToken(payload: any) {
    const secret = process.env.access_secret!;
    return this.jwtService.sign(payload, {
        secret,
        expiresIn: '900s',
    });
    }

    generateRefreshToken(payload: any){
        const secret = process.env.refresh_secret!;
        return this.jwtService.sign(payload, {
            secret,
            expiresIn: '7d'
        })
    }
    async validateStudent(email: string, p: string): Promise<any>{
        console.log('Auth service.validateStudent email:', email);
        const student = await this.studentsService.findByEmail(email);
        console.log('AuthService.validateStudent found student:', student);

        if(!student) throw new UnauthorizedException('Invalid credentials');

        const isMatch = await bcrypt.compare(p, student.password);
        console.log('AuthService.validateStudent password match:', isMatch);
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

        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // Make sure this method exists!
        if (typeof this.studentsService.setCurrentRefreshToken === 'function') {
            await this.studentsService.setCurrentRefreshToken(student._id, refreshToken);
        } else {
            console.warn(' setCurrentRefreshToken method not found in StudentsService');
        }

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