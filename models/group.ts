import sql from "../db.ts";
import { type User } from "./user.ts";

export interface Group {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertGroup(name: string, isEnabled: boolean) {
  const result = await sql`
    insert into groups
      (name, is_enabled)
    values
      (${name}, ${isEnabled})
    returning 
    id, 
    name,
    is_enabled as "isEnabled",
    created_at as "createdAt",
    updated_at as "updatedAt",
    deleted_at as "deletedAt"
  `;
  return result[0] as Group;
}

export async function updateGroup(
  groupId: number | string,
  name: string,
  isEnabled: boolean,
) {
  const result = await sql`
    update groups
    set
      name = ${name},
      is_enabled = ${isEnabled},
      updated_at = now()
    where
      id = ${groupId}
    returning 
      id,
      name,
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;
  return result[0] as Group;
}

export async function getGroupById(id: number | string) {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM groups
    WHERE id = ${id}
  `;
  return result[0] as Group;
}

export async function getAllGroups() {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM groups
  `;

  return result.map((x) => x as Group);
}

export async function getUserGroups(userId: number) {
  const groups = await sql`
    SELECT
      groups.id,
      groups.name,
      groups.is_enabled AS "isEnabled",
      groups.created_at AS "createdAt",
      groups.updated_at AS "updatedAt",
      groups.deleted_at AS "deletedAt"
    FROM 
      user_group
    INNER JOIN 
      groups ON user_group.group_id = groups.id
    WHERE 
      user_group.user_id = ${userId}
  `;

  return groups.map((x) => x as Group);
}

export async function getGroupUsers(groupId: number) {
  const [users] = await sql`
    SELECT
      users.id,
      users.full_name AS "fullName",
      users.email,
      users.primary_group_id AS "primaryGroupId",
      users.is_enabled AS "isEnabled",
      users.created_at AS "createdAt",
      users.updated_at AS "updatedAt",
      users.deleted_at AS "deletedAt"
    FROM 
      user_group
    INNER JOIN 
      users ON user_group.user_id = users.id
    WHERE 
      user_group.group_id = ${groupId}
  `;

  return users as User[];
}

export async function addUserToGroup(userId: number, groupId: number) {
  await sql`
    INSERT INTO user_group (user_id, group_id)
    VALUES (${userId}, ${groupId})
    ON CONFLICT (user_id, group_id)
    DO NOTHING
  `;
}

export async function enableGroup(groupId: number | string) {
  await sql`
    UPDATE groups
    SET is_enabled = true,
    updated_at = now()
    WHERE id = ${groupId}
  `;
}

export async function disableGroup(groupId: number | string) {
  await sql`
    UPDATE groups
    SET is_enabled = false,
    updated_at = now()
    WHERE id = ${groupId}
  `;
}
