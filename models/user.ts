import sql from "../db.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { getGroupById, type Group } from "./group.ts";

export interface User {
  id: number;
  fullName: string;
  email: string;
  password?: string;
  passwordHash?: string;
  primaryGroupId?: number;
  primaryGroup: Group;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertUser(
  fullName: string,
  email: string,
  password: string,
  primaryGroupId: number,
) {
  const passwordHash = await bcrypt.hash(password);
  const result = await sql.begin(async (sql) => {
    const [user] = await sql`
      insert into users
        (full_name, email, password_hash, primary_group_id)
      values
        (${fullName}, ${email}, ${passwordHash}, ${primaryGroupId})
      returning 
        id,
        full_name as "fullName",
        email,
        is_enabled as "isEnabled",
        created_at as "createdAt",
        updated_at as "updatedAt",
        deleted_at as "deletedAt"
    `;

    await sql`
      insert into user_group
        (user_id, group_id)
      values
        (${user.id}, ${primaryGroupId})
    `;

    return user;
  });

  const group = await getGroupById(primaryGroupId);

  return {
    ...result,
    primaryGroup: group,
  } as User;
}

export async function updateUser(
  userId: number,
  fullName: string,
  email: string,
  primaryGroupId: number,
  isEnabled: boolean,
): Promise<User | null> {
  const userToUpdate = await getUserById(userId);
  if (!userToUpdate) {
    return null;
  }

  const oldPrimaryGroupId = userToUpdate.primaryGroupId;

  const result = await sql.begin(async (sql) => {
    const [updatedUser] = await sql`
      UPDATE users
      SET
        full_name = ${fullName},
        email = ${email},
        primary_group_id = ${primaryGroupId},
        is_enabled = ${isEnabled},
        updated_at = now()
      WHERE id = ${userId}
      RETURNING 
        id,
        full_name as "fullName",
        email,
        primary_group_id as "primaryGroupId",
        is_enabled as "isEnabled",
        created_at as "createdAt",
        updated_at as "updatedAt",
        deleted_at as "deletedAt"
    `;

    if (oldPrimaryGroupId !== primaryGroupId) {
      await sql`
        DELETE FROM user_group
        WHERE user_id = ${userId} AND group_id = ${oldPrimaryGroupId!}
      `;

      await sql`
        INSERT INTO user_group
          (user_id, group_id)
        VALUES
          (${userId}, ${primaryGroupId})
      `;
    }

    return updatedUser;
  });

  if (!result) {
    return null;
  }

  result.primaryGroup = await getGroupById(result.primaryGroupId!);

  return result as User;
}

export async function getUserById(id: number) {
  const [user] = await sql`
    SELECT
    id,
    full_name AS "fullName",
    email,
    primary_group_id AS "primaryGroupId",
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM users
    WHERE id = ${id}
  ` as User[];

  user.primaryGroup = await getGroupById(user.primaryGroupId!);

  return user;
}

export async function getAllUsers() {
  const users = await sql`
    SELECT
      users.id,
      users.full_name AS "fullName",
      users.email,
      users.is_enabled AS "isEnabled",
      users.created_at AS "createdAt",
      users.updated_at AS "updatedAt",
      users.deleted_at AS "deletedAt",
      json_build_object(
        'id', groups.id,
        'name', groups.name
      ) AS "primaryGroup"
    FROM 
      users
    INNER JOIN 
      groups ON users.primary_group_id = groups.id
  ` as User[];

  return users;
}

export async function getUserByEmail(email: string) {
  const [user] = await sql`
    SELECT
    id,
    full_name AS "fullName",
    email,
    password_hash AS "passwordHash",
    primary_group_id AS "primaryGroupId",
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM users
    WHERE email = ${email}
  ` as User[];

  if (!user) {
    return null;
  }

  user.primaryGroup = await getGroupById(user.primaryGroupId!);

  return user;
}

export async function getUserGroups(userId: number) {
  const [groups] = await sql`
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

  return groups as Group[];
}

export async function enableUser(userId: number) {
  await sql`
    UPDATE users
    SET
      is_enabled = true,
      updated_at = now()
    WHERE id = ${userId}
  `;
}

export async function disableUser(userId: number) {
  await sql`
    UPDATE users
    SET
      is_enabled = false,
      updated_at = now()
    WHERE id = ${userId}
  `;
}
