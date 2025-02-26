import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddModuleColumnsInPermissionTableMigration1740543509924
  implements MigrationInterface
{
  name = ' AddModuleColumnsInPermissionTableMigration1740543509924';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD \`module\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD \`submodule\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD UNIQUE INDEX \`IDX_06e470c75bfcd4ffa0cae37d8a\` (\`name\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD \`description\` text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` CHANGE \`isActive\` \`isActive\` tinyint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP COLUMN \`description\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD \`description\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP INDEX \`IDX_06e470c75bfcd4ffa0cae37d8a\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP COLUMN \`submodule\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP COLUMN \`module\``,
    );
  }
}
