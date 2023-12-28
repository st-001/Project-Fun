import sql from "../db.ts";
import { getUserById, User } from "./user.ts";

export interface Note {
  id: number;
  entityType: "user" | "group" | "project" | "task" | "client" | "contact";
  entityId: number;
  content: string;
  isEnabled: boolean;
  createdAt: Date;
  createdBy: User;
}

export async function insertNote(
  entityType: "user" | "group" | "project" | "task" | "client" | "contact",
  entityId: number,
  content: string,
  createdById: number,
) {
  const insertResult = await sql`
    insert into note
      (entity_type, entity_id, content, created_by, updated_by)
    values
      (${entityType}, ${entityId}, ${content}, ${createdById}, ${createdById})
    returning
    id,
    entity_type as "entityType",
    entity_id as "entityId",
    content,
    created_at as "createdAt"
  `;

  const note = insertResult[0] as Note;
  note.createdBy = await getUserById(createdById) as User;

  return note;
}
