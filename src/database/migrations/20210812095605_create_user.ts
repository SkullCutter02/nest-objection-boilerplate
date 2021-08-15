import * as Knex from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.timestamp("created_at").notNullable();
    table.timestamp("updated_at").notNullable();
    table.string("name").notNullable();
    table.string("email").unique().notNullable();
    table.string("hash").notNullable();
    table.string("current_hashed_refresh_token");
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("users");
}
