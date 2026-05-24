import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private readonly jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest();

        const authHeader = request.headers.authorization;
        if(!authHeader) throw new UnauthorizedException();

        const token = this.extractTokenFromHeader(authHeader);

        console.log('AuthGuard token:', token);
        console.log('AuthGuard authHeader:', authHeader);

        if(!token) throw new UnauthorizedException();

        try{
            const payload = await this.jwtService.verifyAsync(token);

            request.student = payload;

            return true;
        }catch(err){
            console.log('AuthGuard error:', err);
            throw new UnauthorizedException("Invalid or expired token");
        }
        return true;
    }

    private extractTokenFromHeader(authHeader: string): any {
        const [type, token] = authHeader?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}