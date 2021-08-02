import {MigrationInterface, QueryRunner} from "typeorm";

export class ViewsOnPosts1627896988446 implements MigrationInterface {
    name = 'ViewsOnPosts1627896988446'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ADD "views" integer NOT NULL DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "views"`);
    }

}
