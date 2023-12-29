import sql from "../db.ts";
import { getProjectById, type Project } from "./project.ts";

export interface Task {
  id: number;
  name: string;
  isEnabled: boolean;
  project: Project;
  projectId?: number | string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertTask(
  name: string,
  isEnabled: boolean,
  projectId: number | string,
  createdById: number,
) {
  const insertResult = await sql`
    insert into task
      (name, is_enabled, project_id, created_by, updated_by)
    values
      (${name}, ${isEnabled}, ${projectId}, ${createdById}, ${createdById})
    returning 
    id, 
    name,
    project_id as "projectId",
    is_enabled as "isEnabled",
    created_at as "createdAt",
    updated_at as "updatedAt",
    deleted_at as "deletedAt"
  `;

  const task = insertResult[0] as Task;
  if (task) {
    const project = await getProjectById(projectId);
    return { ...task, project };
  }
  return null;
}

export async function updateTask(
  taskId: number | string,
  name: string,
  projectId: number | string,
  isEnabled: boolean,
  updatedById: number,
) {
  const updateResult = await sql`
    update task
    set
      name = ${name},
      is_enabled = ${isEnabled},
      project_id = ${projectId},
      updated_at = now(),
      updated_by = ${updatedById}
    where
      id = ${taskId}
    returning 
      id,
      name,
      project_id as "projectId",
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;

  const task = updateResult[0] as Task;

  if (task) {
    const project = await getProjectById(projectId);
    return { ...task, project };
  }
  return null;
}

export async function getTaskById(id: number | string) {
  const result = await sql`
    SELECT
    task.id,
    task.name,
    task.is_enabled AS "isEnabled",
    task.created_at AS "createdAt",
    task.updated_at AS "updatedAt",
    task.deleted_at AS "deletedAt",
    project.id AS "projectId",
    project.name AS "projectName"
    FROM task
    INNER JOIN project ON task.project_id = project.id
    WHERE task.id = ${id}
  `;

  if (result.length === 0) {
    return null;
  }

  const project = await getProjectById(result[0].projectId);

  return {
    id: result[0].id,
    name: result[0].name,
    isEnabled: result[0].isEnabled,
    createdAt: result[0].createdAt,
    updatedAt: result[0].updatedAt,
    deletedAt: result[0].deletedAt,
    project,
  } as Task;
}

export async function getAllTasks(
  options: {
    projectId?: number;
    isEnabled?: boolean;
  } = {},
) {
  const { projectId, isEnabled } = options;
  const result = await sql`
    SELECT
    task.id,
    task.name,
    task.is_enabled AS "isEnabled",
    task.project_id AS "projectId",
    task.created_at AS "createdAt",
    task.updated_at AS "updatedAt",
    task.deleted_at AS "deletedAt",
    project.id AS "projectId",
    project.name AS "projectName",
    client.id AS "clientId",
    client.name AS "clientName"
    FROM task
    INNER JOIN project ON task.project_id = project.id
    INNER JOIN client ON project.client_id = client.id
    WHERE
    1 = 1
    ${projectId ? sql`AND task.project_id = ${projectId}` : sql``}
    ${
    typeof isEnabled !== "undefined"
      ? sql`AND task.is_enabled = ${isEnabled}`
      : sql``
  }
  `;

  return result.map((task) => ({
    ...task,
    project: {
      id: task.projectId,
      name: task.projectName,
      client: {
        id: task.clientId,
        name: task.clientName,
      },
    },
  }));
}

export async function enableTask(taskId: number | string, updatedById: number) {
  await sql`
    UPDATE task
    SET is_enabled = true,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${taskId}
  `;
}

export async function disableTask(
  taskId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE task
    SET is_enabled = false,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${taskId}
  `;
}
