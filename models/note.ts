import xa from "https://esm.sh/v132/ajv-formats@2.1.1/denonext/ajv-formats.mjs";
import sql from "../db.ts";
import { getUserById, User } from "./user.ts";

export enum EntityType {
  User = "user",
  Group = "group",
  Project = "project",
  Task = "task",
  Client = "client",
  Contact = "contact",
}

export interface Note {
  id: number;
  entityType: EntityType;
  entityId: number;
  content: string;
  createdAt: Date;
  createdBy: User;
}

export async function insertNote(
  entityType: EntityType,
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

export async function getNotesByEntityAndId(
  entityType: EntityType,
  entityId: number,
) {
  const result = await sql`
  SELECT
    note.id,
    note.entity_type as "entityType",
    note.entity_id as "entityId",
    note.content,
    note.created_at as "createdAt",
    users.id as "createdById",
    users.name as "createdByName"
  FROM
    note
  INNER JOIN
    users
  ON
    note.created_by = users.id
  WHERE
    note.entity_type = ${entityType}
    AND note.entity_id = ${entityId}
  ORDER BY
    note.created_at DESC
  `;

  return result.map((note) => ({
    id: note.id,
    entityType: note.entityType,
    entityId: note.entityId,
    content: note.content,
    createdAt: note.createdAt,
    createdBy: {
      id: note.createdById,
      name: note.createdByName,
    },
  })) as Note[];
}
