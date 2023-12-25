import sql from "../db.ts";

export interface Client {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertClient(
  name: string,
  isEnabled: boolean,
  createdById: number,
) {
  const result = await sql`
    insert into client
      (name, is_enabled, created_by, updated_by)
    values
      (${name}, ${isEnabled}, ${createdById}, ${createdById})
    returning 
    id, 
    name,
    is_enabled as "isEnabled",
    created_at as "createdAt",
    updated_at as "updatedAt",
    deleted_at as "deletedAt"
  `;
  return result[0] as Client;
}

export async function updateClient(
  clientId: number | string,
  name: string,
  isEnabled: boolean,
  updatedById: number,
) {
  const result = await sql`
    update client
    set
      name = ${name},
      is_enabled = ${isEnabled},
      updated_at = now(),
      updated_by = ${updatedById}
    where
      id = ${clientId}
    returning 
      id,
      name,
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;
  return result[0] as Client;
}

export async function getClientById(id: number | string) {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM client
    WHERE id = ${id}
  `;
  return result[0] as Client;
}

export async function getAllClients() {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM client
  `;

  return result.map((x) => x as Client);
}

export async function enableClient(
  clientId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE client
    SET is_enabled = true,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${clientId}
  `;
}

export async function disableClient(
  clientId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE client
    SET is_enabled = false,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${clientId}
  `;
}
