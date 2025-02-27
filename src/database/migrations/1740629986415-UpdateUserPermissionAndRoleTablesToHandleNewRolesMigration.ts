import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUserPermissionAndRoleTablesToHandleNewRolesMigration1740629986415
  implements MigrationInterface
{
  name =
    ' UpdateUserPermissionAndRoleTablesToHandleNewRolesMigration1740629986415';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user_role\` CHANGE \`name\` \`name\` enum ('ADMIN', 'SYSTEM_ADMIN', 'DOCTOR', 'RECEPTIONIST', 'BILLING', 'PHARMACIST', 'MANAGER', 'PATIENT') NOT NULL`,
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
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'SYSTEM_ADMIN', 'DOCTOR', 'RECEPTIONIST', 'BILLING', 'PHARMACIST', 'MANAGER', 'PATIENT') NOT NULL DEFAULT 'DOCTOR'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` CHANGE \`role\` \`role\` enum ('ADMIN', 'SYSTEM_ADMIN', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'COUNSELOR', 'THERAPIST', 'BEHAVIORAL_THERAPIST', 'FAMILY_THERAPIST', 'CHILD_THERAPIST', 'ADDICTION_COUNSELOR', 'CASE_MANAGER', 'SOCIAL_WORKER', 'INTAKE_COORDINATOR', 'CLINICAL_DIRECTOR', 'PRACTICE_MANAGER', 'RECEPTIONIST', 'BILLING_SPECIALIST', 'PATIENT', 'GUARDIAN') NOT NULL DEFAULT 'PATIENT'`,
    );
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
      `ALTER TABLE \`user_role\` CHANGE \`name\` \`name\` enum ('ADMIN', 'SYSTEM_ADMIN', 'PSYCHIATRIST', 'PSYCHOLOGIST', 'COUNSELOR', 'THERAPIST', 'BEHAVIORAL_THERAPIST', 'FAMILY_THERAPIST', 'CHILD_THERAPIST', 'ADDICTION_COUNSELOR', 'CASE_MANAGER', 'SOCIAL_WORKER', 'INTAKE_COORDINATOR', 'CLINICAL_DIRECTOR', 'PRACTICE_MANAGER', 'RECEPTIONIST', 'BILLING_SPECIALIST', 'PATIENT', 'GUARDIAN') NOT NULL`,
    );
  }
}
