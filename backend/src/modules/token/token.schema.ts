import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlacklistedTokenDocument = BlacklistedToken & Document;

@Schema({
    collection: 'blacklisted_tokens',
    timestamps: true,
})
export class BlacklistedToken {
    @Prop({ required: true, unique: true })
    token: string;

    @Prop({ required: true, index: true }) // TTL index
    expiresAt: Date;

    constructor(token: string, expiresAt: Date) {
        this.token = token;
        this.expiresAt = expiresAt;
    }
}

export const BlacklistedTokenSchema = SchemaFactory.createForClass(BlacklistedToken);

// TTL Index (MongoDB will auto-delete after expiration)
BlacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });