import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { StudentsModule } from '../student/student.module';
import { TokenBlacklistService } from '../token/token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlacklistedToken, BlacklistedTokenSchema } from '../token/token.schema';

@Module({
    imports: [
        ConfigModule,                    // ← Add this
        MongooseModule.forFeature([{ name: BlacklistedToken.name, schema: BlacklistedTokenSchema }]),
        StudentsModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>('access_secret'),
                signOptions: { expiresIn: '15m' },
            }),
        }),
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        JwtStrategy, 
        TokenBlacklistService,
        ConfigService   // ← Add this
    ],
    exports: [AuthService],
})
export class AuthModule {}