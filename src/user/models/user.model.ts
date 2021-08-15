import Objection, { JSONSchema } from "objection";

import { SoftDeleteModel } from "../../database/softDelete.model";

export class User extends SoftDeleteModel {
  static tableName = "users";

  name: string;

  email: string;

  hash: string;

  currentHashedRefreshToken?: string;

  $formatJson(jsonRaw: Objection.Pojo): Objection.Pojo {
    const json = super.$formatJson(jsonRaw);
    return { ...json, hash: undefined, currentHashedRefreshToken: undefined };
  }

  static jsonSchema: JSONSchema = {
    type: "object",
    required: ["name", "email", "hash"],
    properties: {
      name: { type: "string" },
      email: { type: "string", format: "email" },
      hash: { type: "string" },
      currentHashedRefreshToken: { type: "string" },
    },
  };
}
