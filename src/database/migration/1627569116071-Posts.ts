import {MigrationInterface, QueryRunner} from "typeorm";

export class Posts1627569116071 implements MigrationInterface {
    name = 'Posts1627569116071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "post_model" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_9d352db580aaf4e810bf9bb9302" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "post_model" ADD CONSTRAINT "FK_7a21dcbce1107bed3a23abd7cde" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post_model" DROP CONSTRAINT "FK_7a21dcbce1107bed3a23abd7cde"`);
        await queryRunner.query(`DROP TABLE "post_model"`);
    }

}
