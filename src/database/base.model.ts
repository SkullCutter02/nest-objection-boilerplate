import { Model } from "objection";
import { v4 as uuid } from "uuid";

export class BaseModel extends Model {
  id: string;

  createdAt: string;

  updatedAt: string;

  $beforeInsert(): Promise<any> | void {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate(): Promise<any> | void {
    this.updatedAt = new Date().toISOString();
  }
}
