import sql from "../db.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { getGroupById, type Group } from "./group.ts";

export interface User {
  id: number;
  name: string;
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
  name: string,
  email: string,
  password: string,
  primaryGroupId: number,
  isEnabled: boolean,
) {
  const passwordHash = await bcrypt.hash(password);
  const result = await sql.begin(async (sql) => {
    const [user] = await sql`
      insert into users
        (name, email, password_hash, primary_group_id, is_enabled)
      values
        (${name}, ${email}, ${passwordHash}, ${primaryGroupId}, ${isEnabled})
      returning 
        id,
        name,
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
  userId: number | string,
  name: string,
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
        name = ${name},
        email = ${email},
        primary_group_id = ${primaryGroupId},
        is_enabled = ${isEnabled},
        updated_at = now()
      WHERE id = ${userId}
      RETURNING 
        id,
        name,
        email,
        primary_group_id as "primaryGroupId",
        is_enabled as "isEnabled",
        created_at as "createdAt",
        updated_at as "updatedAt",
        deleted_at as "deletedAt"
    `;

    if (oldPrimaryGroupId !== primaryGroupId) {
      await sql`
        INSERT INTO user_group
          (user_id, group_id)
        VALUES
          (${userId}, ${primaryGroupId})
        ON CONFLICT (user_id, group_id) 
        DO NOTHING;
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

export async function getUserById(id: number | string) {
  const [user] = await sql`
    SELECT
    id,
    name,
    email,
    primary_group_id AS "primaryGroupId",
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM users
    WHERE id = ${id}
  ` as User[];

  if (!user) {
    return null;
  }

  user.primaryGroup = await getGroupById(user.primaryGroupId!);

  return user;
}

export async function getAllUsers() {
  const users = await sql`
    SELECT
      users.id,
      users.name,
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
    name,
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

export async function enableUser(userId: number | string) {
  await sql`
    UPDATE users
    SET
      is_enabled = true,
      updated_at = now()
    WHERE id = ${userId}
  `;
}

export async function disableUser(userId: number | string) {
  await sql`
    UPDATE users
    SET
      is_enabled = false,
      updated_at = now()
    WHERE id = ${userId}
  `;
}

export async function resetUserPassword(
  userId: number,
  newPassword: string,
) {
  const passwordHash = await bcrypt.hash(newPassword);

  const [result] = await sql`
    UPDATE users
    SET
      password_hash = ${passwordHash},
      updated_at = now()
    WHERE id = ${userId}
    RETURNING id
  `;

  return result ? true : false;
}
