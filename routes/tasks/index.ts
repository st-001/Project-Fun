import { Handlers } from "$fresh/server.ts";
import { getAllTasks, insertTask } from "../../models/task.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";
import ajv from "../../ajv.ts";

export const GET_QUERY_SCHEMA = {
  type: "object",
  properties: {
    projectId: {
      type: "string",
      pattern: "^[0-9]+$",
    },
    isEnabled: {
      type: "string",
      enum: ["true", "false"],
    },
  },
  required: [],
  additionalProperties: false,
};

export const GET_RESPONSE_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: {
        type: "integer",
      },
      name: {
        type: "string",
      },
      projectId: {
        type: "integer",
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
      isEnabled: {
        type: "boolean",
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
    required: [
      "id",
      "name",
      "isEnabled",
      "createdAt",
      "updatedAt",
      "projectId",
      "project",
    ],
    additionalProperties: false,
  },
};

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    projectId: { type: "integer" },
    isEnabled: { type: "boolean" },
  },
  required: ["name", "isEnabled"],
  additionalProperties: false,
};

export const POST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    isEnabled: { type: "boolean" },
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
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
    },
  },
  required: ["id", "name", "isEnabled", "createdAt", "updatedAt", "project"],
  additionalProperties: false,
};

const getQueryValidator = ajv.compile(GET_QUERY_SCHEMA);
const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(req, _ctx) {
    try {
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams);
      const query: {
        projectId?: number;
        isEnabled?: boolean;
      } = {};

      if (Object.keys(queryParams).length) {
        if (!getQueryValidator(queryParams)) {
          return httpJsonResponse(getQueryValidator.errors, 400);
        }
        if (queryParams.projectId) {
          query["projectId"] = Number(queryParams.projectId);
        }
        if (queryParams.isEnabled) {
          query["isEnabled"] = queryParams.isEnabled === "true";
        }
      }

      const tasks = await getAllTasks(query);
      return httpJsonResponse(tasks, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, ctx) {
    try {
      const task = await req.json() as {
        name: string;
        isEnabled: boolean;
        projectId: number;
      };

      if (!postRequestValidator(task)) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertTask(
        task.name,
        task.isEnabled,
        task.projectId,
        ctx.state.userId as number,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
