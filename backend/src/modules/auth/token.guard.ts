import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { TokenBlacklistService } from "../token/token.service";

@Injectable()
export class TokenBlacklistGuard implements CanActivate{
    constructor( private readonly tokenBlacklistSetvice: TokenBlacklistService){}

    async canActivate(context: ExecutionContext): Promise<boolean>{
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers['authorization'];

        if(!authHeader) throw new UnauthorizedException('No authorization header');

        const token = authHeader.replace('Bearer ', '');

        const isBlackListed = await this.tokenBlacklistSetvice.isBlacklisted(token);
        if(isBlackListed) throw new UnauthorizedException('Token is invalidated');

        return true
    }
}