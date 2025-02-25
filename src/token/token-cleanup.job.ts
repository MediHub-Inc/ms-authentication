import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TokenCleanupService } from './token-cleanup.service';

@Injectable()
export class TokenCleanupJob {
  constructor(private readonly tokenCleanupService: TokenCleanupService) {}

  // 🕒 Ejecutar cada día a la medianoche
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanup() {
    await this.tokenCleanupService.deleteExpiredTokens();
  }
}
