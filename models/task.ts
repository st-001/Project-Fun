import sql from "../db.ts";

export interface Task {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertTask(name: string, isEnabled: boolean) {
  const result = await sql`
    insert into task
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
  return result[0] as Task;
}

export async function updateTask(
  taskId: number | string,
  name: string,
  isEnabled: boolean,
) {
  const result = await sql`
    update task
    set
      name = ${name},
      is_enabled = ${isEnabled},
      updated_at = now()
    where
      id = ${taskId}
    returning 
      id,
      name,
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;
  return result[0] as Task;
}

export async function getTaskById(id: number | string) {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM task
    WHERE id = ${id}
  `;
  return result[0] as Task;
}

export async function getAllTasks() {
  const result = await sql`
    SELECT
    id,
    name,
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM task
  `;

  return result.map((x) => x as Task);
}

export async function enableTask(taskId: number | string) {
  await sql`
    UPDATE task
    SET is_enabled = true,
    updated_at = now()
    WHERE id = ${taskId}
  `;
}

export async function disableTask(taskId: number | string) {
  await sql`
    UPDATE task
    SET is_enabled = false,
    updated_at = now()
    WHERE id = ${taskId}
  `;
}