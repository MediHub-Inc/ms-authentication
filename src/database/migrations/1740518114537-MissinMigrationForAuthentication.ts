import { MigrationInterface, QueryRunner } from 'typeorm';

export class MissinMigrationForAuthentication1740518114537
  implements MigrationInterface
{
  name = ' MissinMigrationForAuthentication1740518114537';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_324f2c4c7b658100d7f994e57b1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_324f2c4c7b658100d7f994e57b\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\``,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_token\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(512) NOT NULL, \`expiresIn\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`authentication_code\` (\`id\` varchar(36) NOT NULL, \`code\` varchar(255) NOT NULL, \`grantType\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, UNIQUE INDEX \`IDX_86c3ffb3859050f0e088618ae2\` (\`code\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` DROP COLUMN \`status\``,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`email\``);
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD \`isActive\` tinyint NOT NULL DEFAULT 1`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD \`email\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`ruc\``);
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD \`ruc\` varchar(11) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD UNIQUE INDEX \`IDX_98824361ec56fb3b4b611b5f19\` (\`ruc\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_dfda472c0af7812401e592b6a61\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` ADD CONSTRAINT \`FK_8e913e288156c133999341156ad\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`authentication_code\` ADD CONSTRAINT \`FK_06c870499707baac415ee857222\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`authentication_code\` DROP FOREIGN KEY \`FK_06c870499707baac415ee857222\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_token\` DROP FOREIGN KEY \`FK_8e913e288156c133999341156ad\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_dfda472c0af7812401e592b6a61\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` DROP INDEX \`IDX_98824361ec56fb3b4b611b5f19\``,
    );
    await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`ruc\``);
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD \`ruc\` bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP COLUMN \`email\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` DROP COLUMN \`isActive\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`email\` varchar(25) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD \`status\` enum ('ACTIVE', 'DISABLED', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE'`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_86c3ffb3859050f0e088618ae2\` ON \`authentication_code\``,
    );
    await queryRunner.query(`DROP TABLE \`authentication_code\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_c31d0a2f38e6e99110df62ab0a\` ON \`refresh_token\``,
    );
    await queryRunner.query(`DROP TABLE \`refresh_token\``);
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\` (\`userId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\` (\`organizationId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`IDX_324f2c4c7b658100d7f994e57b\` ON \`user\` (\`organizationId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_324f2c4c7b658100d7f994e57b1\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }
}
