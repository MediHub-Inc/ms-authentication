import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserRolePermissionTablesMigration1740182850534
  implements MigrationInterface
{
  name = 'UserRolePermissionTablesMigration1740182850534';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`givenName\` \`firstName\` varchar(25) NOT NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_permission\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NOT NULL, \`moduleId\` varchar(255) NULL, \`submoduleId\` varchar(255) NULL, \`isActive\` tinyint NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role\` (\`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`id\` int NOT NULL AUTO_INCREMENT, \`name\` enum ('ADMIN', 'SYSTEM_ADMIN', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'COUNSELOR', 'THERAPIST', 'BEHAVIORAL_THERAPIST', 'FAMILY_THERAPIST', 'CHILD_THERAPIST', 'ADDICTION_COUNSELOR', 'CASE_MANAGER', 'SOCIAL_WORKER', 'INTAKE_COORDINATOR', 'CLINICAL_DIRECTOR', 'PRACTICE_MANAGER', 'RECEPTIONIST', 'BILLING_SPECIALIST', 'PATIENT', 'GUARDIAN') NOT NULL, \`description\` text NULL, \`isActive\` tinyint NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user_role_permissions\` (\`user_role_id\` int NOT NULL, \`user_permission_id\` int NOT NULL, INDEX \`IDX_a6b2a262b22be30123d9d9fe51\` (\`user_role_id\`), INDEX \`IDX_45bcb66f73bb17605d4a6f9de2\` (\`user_permission_id\`), PRIMARY KEY (\`user_role_id\`, \`user_permission_id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'SYSTEM_ADMIN', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'COUNSELOR', 'THERAPIST', 'BEHAVIORAL_THERAPIST', 'FAMILY_THERAPIST', 'CHILD_THERAPIST', 'ADDICTION_COUNSELOR', 'CASE_MANAGER', 'SOCIAL_WORKER', 'INTAKE_COORDINATOR', 'CLINICAL_DIRECTOR', 'PRACTICE_MANAGER', 'RECEPTIONIST', 'BILLING_SPECIALIST', 'PATIENT', 'GUARDIAN') NOT NULL DEFAULT 'PATIENT'`,
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
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('administrator', 'customer', 'editor') NOT NULL DEFAULT 'customer'`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_45bcb66f73bb17605d4a6f9de2\` ON \`user_role_permissions\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_a6b2a262b22be30123d9d9fe51\` ON \`user_role_permissions\``,
    );
    await queryRunner.query(`DROP TABLE \`user_role_permissions\``);
    await queryRunner.query(`DROP TABLE \`user_role\``);
    await queryRunner.query(`DROP TABLE \`user_permission\``);
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`firstName\` \`givenName\` varchar(25) NOT NULL`,
    );
  }
}
