import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlacklistedToken, BlacklistedTokenDocument } from './token.schema';

@Injectable()
export class TokenBlacklistService {
    constructor(
        @InjectModel(BlacklistedToken.name) 
        private blacklistModel: Model<BlacklistedTokenDocument>,
    ) {}

    async blacklistToken(token: string, expiresAt: Date): Promise<void> {
        await this.blacklistModel.create({ token, expiresAt });
    }

    async isBlacklisted(token: string): Promise<boolean> {
        const blacklisted = await this.blacklistModel.findOne({ token });
        return !!blacklisted;
    }
}