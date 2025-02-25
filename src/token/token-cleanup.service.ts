import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './refresh-token.model';

@Injectable()
export class TokenCleanupService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async deleteExpiredTokens() {
    await this.refreshTokenRepository
      .createQueryBuilder()
      .delete()
      .from(RefreshToken)
      .where('expiresAt < :now', { now: new Date() })
      .execute();
    
    console.log('✅ Expired refresh tokens deleted');
  }
}
