import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRefreshCountColumnInRefreshTokenTableMigration1740525636144
  implements MigrationInterface
{
  name = 'AddRefreshCountColumnInRefreshTokenTableMigration1740525636144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` ADD \`refreshCount\` int NOT NULL DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` DROP COLUMN \`refreshCount\``,
    );
  }
}
