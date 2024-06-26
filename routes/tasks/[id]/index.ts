import { Handlers } from "$fresh/server.ts";
import { getTaskById, updateTask } from "../../../models/task.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";
import ajv from "../../../ajv.ts";

export const GET_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: {
      type: "integer",
    },
    name: {
      type: "string",
    },
    isEnabled: {
      type: "boolean",
    },
    project: {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        name: {
          type: "string",
        },
        client: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
          },
          required: [
            "id",
            "name",
          ],
          additionalProperties: false,
        },
      },
      required: [
        "id",
        "name",
        "client",
      ],
      additionalProperties: false,
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
    },
  },
  required: ["id", "name", "project", "isEnabled", "createdAt", "updatedAt"],
};

export const PUT_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    projectId: { type: "integer" },
    isEnabled: { type: "boolean" },
  },
  required: ["name", "isEnabled"],
  additionalProperties: false,
};

export const PUT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    project: {
      type: "object",
      properties: {
        id: {
          type: "integer",
        },
        name: {
          type: "string",
        },
        client: {
          type: "object",
          properties: {
            id: {
              type: "integer",
            },
            name: {
              type: "string",
            },
          },
          required: [
            "id",
            "name",
          ],
          additionalProperties: false,
        },
      },
      required: [
        "id",
        "name",
        "client",
      ],
      additionalProperties: false,
    },
    isEnabled: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
    },
  },
  required: ["id", "name", "project", "isEnabled", "createdAt", "updatedAt"],
  additionalProperties: false,
};

const putRequestValidator = ajv.compile(PUT_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const task = await getTaskById(ctx.params.id);
      if (!task) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(task, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async PUT(req, ctx) {
    try {
      const taskId = ctx.params.id;
      const taskToUpdate = await getTaskById(taskId);

      if (!taskToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json() as {
        name: string;
        projectId: number;
        isEnabled: boolean;
      };

      if (!putRequestValidator(updateData)) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const updatedTask = await updateTask(
        taskId,
        updateData.name,
        updateData.projectId,
        updateData.isEnabled,
        ctx.state.userId as number,
      );

      if (!updatedTask) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedTask, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
