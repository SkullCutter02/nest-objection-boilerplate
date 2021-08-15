import * as Knex from "knex";
import { v4 as uuid } from "uuid";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      email: "coolalan2016@gmail.com",
      name: "alan",
      hash: "$argon2i$v=19$m=16,t=2,p=1$OEhLSjJGTWw0OHY3N2E0TA$HT/JuBQ50jkrhhNsQYCVIQ",
    },
  ]);
}
