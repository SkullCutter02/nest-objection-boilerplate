import { knexSnakeCaseMappers } from "objection";
import Knex from "knex";

const knexConfig: Knex.Config = {
  client: "postgresql",
  useNullAsDefault: true,
  connection: {
    host: "localhost",
    port: 5432,
    database: "sfs_db",
    user: "skullcutter",
    password: null,
  },
  migrations: {
    tableName: "migrations",
    directory: __dirname + "/../database/migrations",
  },
  seeds: {
    directory: __dirname + "/../database/seeds",
  },
  ...knexSnakeCaseMappers(),
};

export default knexConfig;
