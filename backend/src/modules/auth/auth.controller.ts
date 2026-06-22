import { 
    Controller, Post, Get, Body, UseGuards, 
    BadRequestException, HttpCode, HttpStatus, NotFoundException, 
    UnauthorizedException, Req, Res,
    } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { StudentsService } from '../student/student.service';
import { Student } from '../student/student.schema';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { access } from 'fs';
import { PassThrough } from 'stream';
import { TokenBlacklistService } from '../token/token.service';
import { ConfigService } from '@nestjs/config/dist/config.service';

@Controller('auth')
export class AuthController {
constructor(
    private readonly authService: AuthService,
    private readonly studentsService: StudentsService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
    private readonly configService: ConfigService,
) {}
@HttpCode(HttpStatus.OK)
@Post('login')
async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
) {

    try {
        const student = await this.authService.validateStudent(
            loginDto.email, 
            loginDto.password
        );

        const result = await this.authService.login(student);

        res.cookie('refreshToken', result.refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/',
        });

        console.log('Login successful');

        return { 
            access_token: result.access_token,
            message: 'Login successful' 
        };

    } catch (error: any) {
        console.error('ERROR in login controller:', error);
        throw error;
    }
}
    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        let existing: Student | null = null;
        try {
            existing = await this.studentsService.findByEmail(registerDto.email);
        } catch (e) {
            if (!(e instanceof NotFoundException)) throw e;
        }

            if (existing) throw new BadRequestException('Email already in use');
            const student = await this.studentsService.create(registerDto);
            return this.authService.login(student);
        }

        @UseGuards(AuthGuard('jwt'))
        @Get('profile')
        async getProfile(@Req() request: any) {
            const uid = request.user?.sub || request.user?._id;
            if (!uid) throw new BadRequestException('Invalid token: missing user ID');
            const user = await this.studentsService.findByIdWithCourses(uid);
            if (!user) throw new NotFoundException('User not found');
            return user;
        }

    @Post('refresh')
    async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies?.refreshToken;   // from HttpOnly cookie

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        let payload: any;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('refresh_secret'), 
            });
        } catch (e) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }

        // Check if refresh token is still valid in DB
        const student = await this.studentsService.getUserIfRefreshTokenMatches(refreshToken, payload.sub);
        if (!student) {
            throw new UnauthorizedException('Refresh token revoked');
        }

        // Generate new access token
        const newAccessToken = this.authService.generateAccessToken(payload);

        const newRefreshToken = this.authService.generateRefreshToken(payload);
        await this.studentsService.setCurrentRefreshToken(student._id, newRefreshToken);

        return {
            access_token: newAccessToken,
            refresh_token: newRefreshToken  // if using rotation
        };
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('logout')
    async logout(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const uid = req.user?.sub || req.user?._id;

        if (uid) {
            await this.studentsService.removeRefreshToken(uid);
        }

        // Clear the refresh token cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/'
        });

        return { message: 'Logged out successfully' };
    }

    }

