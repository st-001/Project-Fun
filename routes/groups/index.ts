import { Handlers } from "$fresh/server.ts";
import { getAllGroups, type Group, insertGroup } from "../../models/group.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";
import ajv from "../../ajv.ts";

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
    required: ["id", "name", "isEnabled", "createdAt", "updatedAt"],
    additionalProperties: false,
  },
};

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
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
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
    },
  },
  required: ["id", "name", "isEnabled", "createdAt", "updatedAt"],
  additionalProperties: false,
};

const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const groups = await getAllGroups();
      return httpJsonResponse(groups, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, ctx) {
    try {
      const group = await req.json() as Group;
      const validRequest = postRequestValidator(group);

      if (!validRequest) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertGroup(
        group.name,
        group.isEnabled,
        ctx.state.userId as number,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
