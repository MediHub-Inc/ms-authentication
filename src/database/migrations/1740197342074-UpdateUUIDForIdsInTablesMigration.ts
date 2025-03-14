import type { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUUIDForIdsInTablesMigration1740197342074
  implements MigrationInterface
{
  name = ' UpdateUUIDForIdsInTablesMigration1740197342074';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP FOREIGN KEY \`FK_45bcb66f73bb17605d4a6f9de2f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user_permission\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP FOREIGN KEY \`FK_a6b2a262b22be30123d9d9fe519\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user_role\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`user_role\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_324f2c4c7b658100d7f994e57b1\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`organization\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP FOREIGN KEY \`FK_8e6ecd93d94d74454b2ad8ba8f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP PRIMARY KEY`);
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`organizationId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`organizationId\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD UNIQUE INDEX \`IDX_324f2c4c7b658100d7f994e57b\` (\`organizationId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` CHANGE \`id\` \`id\` int NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`user_credential\` DROP PRIMARY KEY`);
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD \`id\` varchar(36) NOT NULL PRIMARY KEY`,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD \`userId\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD UNIQUE INDEX \`IDX_8e6ecd93d94d74454b2ad8ba8f\` (\`userId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_permission_id\`)`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a6b2a262b22be30123d9d9fe51\` ON \`user_role_permissions\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP COLUMN \`user_role_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD \`user_role_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_permission_id\`, \`user_role_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_role_id\`)`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_45bcb66f73bb17605d4a6f9de2\` ON \`user_role_permissions\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP COLUMN \`user_permission_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD \`user_permission_id\` varchar(36) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_role_id\`, \`user_permission_id\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\` (\`organizationId\`)`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\` (\`userId\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_a6b2a262b22be30123d9d9fe51\` ON \`user_role_permissions\` (\`user_role_id\`)`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_45bcb66f73bb17605d4a6f9de2\` ON \`user_role_permissions\` (\`user_permission_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_324f2c4c7b658100d7f994e57b1\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD CONSTRAINT \`FK_8e6ecd93d94d74454b2ad8ba8f8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD CONSTRAINT \`FK_a6b2a262b22be30123d9d9fe519\` FOREIGN KEY (\`user_role_id\`) REFERENCES \`user_role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD CONSTRAINT \`FK_45bcb66f73bb17605d4a6f9de2f\` FOREIGN KEY (\`user_permission_id\`) REFERENCES \`user_permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP FOREIGN KEY \`FK_45bcb66f73bb17605d4a6f9de2f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP FOREIGN KEY \`FK_a6b2a262b22be30123d9d9fe519\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP FOREIGN KEY \`FK_8e6ecd93d94d74454b2ad8ba8f8\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_324f2c4c7b658100d7f994e57b1\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_45bcb66f73bb17605d4a6f9de2\` ON \`user_role_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a6b2a262b22be30123d9d9fe51\` ON \`user_role_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_role_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP COLUMN \`user_permission_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD \`user_permission_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_45bcb66f73bb17605d4a6f9de2\` ON \`user_role_permissions\` (\`user_permission_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_permission_id\`, \`user_role_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_permission_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP COLUMN \`user_role_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD \`user_role_id\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE INDEX \`IDX_a6b2a262b22be30123d9d9fe51\` ON \`user_role_permissions\` (\`user_role_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` DROP PRIMARY KEY`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD PRIMARY KEY (\`user_role_id\`, \`user_permission_id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP INDEX \`IDX_8e6ecd93d94d74454b2ad8ba8f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP COLUMN \`userId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD \`userId\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_8e6ecd93d94d74454b2ad8ba8f\` ON \`user_credential\` (\`userId\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP INDEX \`IDX_324f2c4c7b658100d7f994e57b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP COLUMN \`organizationId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`organizationId\` int NOT NULL`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX \`REL_324f2c4c7b658100d7f994e57b\` ON \`user\` (\`organizationId\`)`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` ADD PRIMARY KEY (\`id\`)`);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_credential\` ADD CONSTRAINT \`FK_8e6ecd93d94d74454b2ad8ba8f8\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`organization\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`organization\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_324f2c4c7b658100d7f994e57b1\` FOREIGN KEY (\`organizationId\`) REFERENCES \`organization\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE \`user_role\` DROP COLUMN \`id\``);
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD CONSTRAINT \`FK_a6b2a262b22be30123d9d9fe519\` FOREIGN KEY (\`user_role_id\`) REFERENCES \`user_role\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` DROP COLUMN \`id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` ADD PRIMARY KEY (\`id\`)`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_permission\` CHANGE \`id\` \`id\` int NOT NULL AUTO_INCREMENT`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_role_permissions\` ADD CONSTRAINT \`FK_45bcb66f73bb17605d4a6f9de2f\` FOREIGN KEY (\`user_permission_id\`) REFERENCES \`user_permission\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
