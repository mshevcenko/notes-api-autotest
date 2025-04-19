import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1744627494442 implements MigrationInterface {
  name = 'Migration1744627494442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL DEFAULT '', "content" character varying NOT NULL DEFAULT '', CONSTRAINT "PK_af6206538ea96c4e77e9f400c3d" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notes"`);
  }
}
