import { Handlers } from "$fresh/server.ts";
import {
  type Client,
  getAllClients,
  insertClient,
} from "../../models/client.ts";
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
      const clients = await getAllClients();
      return httpJsonResponse(clients, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, _ctx) {
    try {
      const client = await req.json() as Client;

      if (!postRequestValidator(client)) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertClient(
        client.name,
        client.isEnabled,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
