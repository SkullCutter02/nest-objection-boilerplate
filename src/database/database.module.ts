import { Module } from "@nestjs/common";
import { ObjectionModule } from "@willsoto/nestjs-objection";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { knexSnakeCaseMappers } from "objection";

@Module({
  imports: [
    ObjectionModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: {
          client: "postgresql",
          useNullAsDefault: true,
          connection: {
            host: configService.get("PG_HOST"),
            port: configService.get("PG_PORT"),
            database: configService.get("PG_DATABASE"),
            user: configService.get("PG_USER"),
            password: configService.get("PG_PASSWORD"),
          },
          migrations: {
            tableName: "migrations",
            directory: __dirname + "/../database/migrations",
          },
          seeds: {
            directory: __dirname + "/../database/seeds",
          },
          ...knexSnakeCaseMappers(),
        },
      }),
    }),
  ],
  exports: [ObjectionModule],
})
export class DatabaseModule {}
