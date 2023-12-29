import sql from "../db.ts";
import { Client, getClientById } from "./client.ts";

export interface Project {
  id: number;
  name: string;
  isEnabled: boolean;
  client: Client;
  clientId?: number | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertProject(
  name: string,
  isEnabled: boolean,
  clientId: number | string,
  createdById: number,
) {
  const insertResult = await sql`
    insert into project
      (name, is_enabled, client_id, created_by, updated_by)
    values
      (${name}, ${isEnabled}, ${clientId}, ${createdById}, ${createdById})
    returning 
    id, 
    name,
    client_id as "clientId",
    is_enabled as "isEnabled",
    created_at as "createdAt",
    updated_at as "updatedAt",
    deleted_at as "deletedAt"
  `;

  const project = insertResult[0] as Project;

  if (project) {
    const client = await getClientById(clientId);
    return { ...project, client };
  }

  return null;
}

export async function updateProject(
  projectId: number | string,
  name: string,
  clientId: number | string,
  isEnabled: boolean,
  updatedById: number,
) {
  const updateResult = await sql`
    update project
    set
      name = ${name},
      client_id = ${clientId},
      is_enabled = ${isEnabled},
      updated_at = now(),
      updated_by = ${updatedById}
    where
      id = ${projectId}
    returning 
      id,
      name,
      client_id as "clientId",
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;

  const project = updateResult[0] as Project;
  if (project) {
    const client = await getClientById(clientId);
    return { ...project, client };
  }

  return null;
}

export async function getProjectById(id: number | string) {
  const result = await sql`
    SELECT
    project.id,
    project.name,
    project.is_enabled AS "isEnabled",
    project.created_at AS "createdAt",
    project.updated_at AS "updatedAt",
    project.deleted_at AS "deletedAt",
    client.id AS "clientId",
    client.name AS "clientName"
    FROM project
    INNER JOIN client ON project.client_id = client.id
    WHERE project.id = ${id}
  `;

  if (result.length === 0) {
    return null;
  }

  return {
    id: result[0].id,
    name: result[0].name,
    isEnabled: result[0].isEnabled,
    createdAt: result[0].createdAt,
    updatedAt: result[0].updatedAt,
    deletedAt: result[0].deletedAt,
    client: {
      id: result[0].clientId,
      name: result[0].clientName,
    },
  } as Project;
}

export async function getAllProjects(
  options: {
    clientId?: number;
    isEnabled?: boolean;
  } = {},
) {
  const { clientId, isEnabled } = options;

  const result = await sql`
    SELECT
      project.id,
      project.name,
      project.is_enabled AS "isEnabled",
      project.created_at AS "createdAt",
      project.updated_at AS "updatedAt",
      project.deleted_at AS "deletedAt",
      client.id AS "clientId",
      client.name AS "clientName"
    FROM project
    INNER JOIN client ON project.client_id = client.id
    WHERE
      1 = 1
      ${clientId ? sql`AND project.client_id = ${clientId}` : sql``}
      ${
    typeof isEnabled !== "undefined"
      ? sql`AND project.is_enabled = ${isEnabled}`
      : sql``
  }
  `;

  return result.map((project) => ({
    ...project,
    client: {
      id: project.clientId,
      name: project.clientName,
    },
  } as Project));
}

export async function enableProject(
  projectId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE project
    SET is_enabled = true,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${projectId}
  `;
}

export async function disableProject(
  projectId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE project
    SET is_enabled = false,
    updated_at = now(),
    updated_by = ${updatedById}
    WHERE id = ${projectId}
  `;
}
