import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RefreshToken } from './refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class TokenCleanupService {
  constructor(
    @InjectModel(RefreshToken.name)
    private readonly refreshTokenModel: Model<RefreshToken>,
  ) {}

  async deleteExpiredTokens(): Promise<void> {
    await this.refreshTokenModel.deleteMany({
      expiresAt: { $lt: new Date() },
    });

    console.log('✅ Expired refresh tokens deleted');
  }
}
