import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1740176777368 implements MigrationInterface {
  name = 'InitialMigration1740176777368';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`organization\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`ruc\` bigint NOT NULL, \`logo\` varchar(120) NULL, \`status\` enum ('ACTIVE', 'DISABLED', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE', PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`givenName\` varchar(25) NOT NULL, \`familyName\` varchar(25) NOT NULL, \`middleName\` varchar(25) NULL, \`role\` enum ('administrator', 'customer', 'editor') NOT NULL DEFAULT 'customer', \`email\` varchar(25) NOT NULL, \`avatar\` varchar(120) NULL, \`status\` enum ('ACTIVE', 'DISABLED', 'ARCHIVED') NOT NULL DEFAULT 'ACTIVE', \`organizationId\` int NOT NULL, UNIQUE INDEX \`REL_324f2c4c7b658100d7f994e57b\` (\`organizationId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_credential\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`username\` varchar(25) NOT NULL, \`passwordHash\` varchar(255) NOT NULL, \`passwordResetHash\` varchar(255) NULL, \`lastLogin\` datetime NULL, \`passwordResetExpirationDate\` datetime NULL, \`userId\` int NOT NULL, UNIQUE INDEX \`REL_8e6ecd93d94d74454b2ad8ba8f\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_324f2c4c7b658100d7f994e57b1\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD CONSTRAINT \`FK_8e6ecd93d94d74454b2ad8ba8f8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP FOREIGN KEY \`FK_8e6ecd93d94d74454b2ad8ba8f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_324f2c4c7b658100d7f994e57b1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\``,
    );
    await queryRunner.query(`DROP TABLE \`user_credential\``);
    await queryRunner.query(
      `DROP INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\``,
    );
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`organization\``);
  }
}
