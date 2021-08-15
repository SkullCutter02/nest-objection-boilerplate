import { BaseModel } from "./base.model";
import Objection from "objection";

export class SoftDeleteModel extends BaseModel {
  static softDelete = true;

  deletedAt: string;

  $formatJson(jsonRaw: Objection.Pojo): Objection.Pojo {
    const json = super.$formatJson(jsonRaw);

    if (this.deletedAt === null) {
      return { ...json, deletedAt: undefined };
    } else {
      return json;
    }
  }
}
