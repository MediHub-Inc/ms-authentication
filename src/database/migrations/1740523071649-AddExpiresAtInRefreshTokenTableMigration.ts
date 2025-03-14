import type { MigrationInterface, QueryRunner } from 'typeorm';

export class AddExpiresAtInRefreshTokenTableMigration1740523071649
  implements MigrationInterface
{
  name = 'AddExpiresAtInRefreshTokenTableMigration1740523071649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` ADD \`expiresAt\` timestamp NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` ADD \`revokedAt\` timestamp NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` DROP COLUMN \`expiresAt\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` DROP COLUMN \`revokedAt\``,
    );
  }
}
