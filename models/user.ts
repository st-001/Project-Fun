import sql from "../db.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";

export interface User {
  id: number;
  name: string;
  emailAddress: string;
  password?: string;
  passwordHash?: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertUser(
  name: string,
  emailAddress: string,
  password: string,
  isEnabled: boolean,
) {
  const passwordHash = await bcrypt.hash(password);
  const insertResult = await sql`
  insert into users
    (name, email_address, password_hash, is_enabled)
  values
    (${name}, ${emailAddress}, ${passwordHash}, ${isEnabled})
  returning 
    id,
    name,
    email_address as "emailAddress",
    is_enabled as "isEnabled",
    created_at as "createdAt",
    updated_at as "updatedAt",
    deleted_at as "deletedAt"
`;

  return insertResult[0] as User;
}

export async function updateUser(
  userId: number | string,
  name: string,
  emailAddress: string,
  isEnabled: boolean,
): Promise<User | null> {
  const userToUpdate = await getUserById(userId);
  if (!userToUpdate) {
    return null;
  }

  const updateResult = await sql`
    UPDATE users
    SET
      name = ${name},
      email_address = ${emailAddress},
      is_enabled = ${isEnabled},
      updated_at = now()
    WHERE id = ${userId}
    RETURNING 
      id,
      name,
      email_address as "emailAddress",
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
      `;

  const user = updateResult[0] as User;

  return user ? user : null;
}

export async function getUserById(id: number | string) {
  const [user] = await sql`
    SELECT
    id,
    name,
    email_address AS "emailAddress",
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

  return user;
}

export async function getAllUsers() {
  const users = await sql`
    SELECT
      users.id,
      users.name,
      users.email_address as "emailAddress",
      users.is_enabled AS "isEnabled",
      users.created_at AS "createdAt",
      users.updated_at AS "updatedAt",
      users.deleted_at AS "deletedAt"
    FROM 
      users
  ` as User[];

  return users;
}

export async function getUserByEmail(email: string) {
  const [user] = await sql`
    SELECT
    id,
    name,
    email_address AS "emailAddress",
    password_hash AS "passwordHash",
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM users
    WHERE email_address = ${email}
  ` as User[];

  if (!user) {
    return null;
  }

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
