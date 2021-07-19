import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitDatabase1620985867193 implements MigrationInterface {
  name = 'InitDatabase1620985867193';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "media_type_enum" AS ENUM('image', 'video')`,
    );
    await queryRunner.query(
      `CREATE TABLE "media" ("id" SERIAL NOT NULL, "originalKey" character varying NOT NULL, "compressedKey" character varying NOT NULL, "type" "media_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM('USER', 'ADMIN')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "role" "user_role_enum" NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "first_name" text, "last_name" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TYPE "media_type_enum"`);
  }
}
