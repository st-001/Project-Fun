import sql from "../db.ts";

export interface Project {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertProject(name: string, isEnabled: boolean) {
  const result = await sql`
    insert into project
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
  return result[0] as Project;
}

export async function updateProject(
  projectId: number | string,
  name: string,
  isEnabled: boolean,
) {
  const result = await sql`
    update project
    set
      name = ${name},
      is_enabled = ${isEnabled},
      updated_at = now()
    where
      id = ${projectId}
    returning 
      id,
      name,
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;
  return result[0] as Project;
}

export async function getProjectById(id: number | string) {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM project
    WHERE id = ${id}
  `;
  return result[0] as Project;
}

export async function getAllProjects() {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM project
  `;

  return result.map((x) => x as Project);
}

export async function enableProject(projectId: number | string) {
  await sql`
    UPDATE project
    SET is_enabled = true,
    updated_at = now()
    WHERE id = ${projectId}
  `;
}

export async function disableProject(projectId: number | string) {
  await sql`
    UPDATE project
    SET is_enabled = false,
    updated_at = now()
    WHERE id = ${projectId}
  `;
}
