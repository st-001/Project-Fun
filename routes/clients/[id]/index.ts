import { Handlers } from "$fresh/server.ts";
import { getClientById, updateClient } from "../../../models/client.ts";
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
};

export const PUT_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
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

const putRequestValidator = ajv.compile(PUT_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const client = await getClientById(ctx.params.id);
      if (!client) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(client, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async PUT(req, ctx) {
    try {
      const clientId = ctx.params.id;
      const clientToUpdate = await getClientById(clientId);

      if (!clientToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json() as {
        name?: string;
        isEnabled?: boolean;
      };

      if (!putRequestValidator(updateData)) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const updatedClient = await updateClient(
        clientId,
        updateData.name ?? clientToUpdate.name,
        updateData.isEnabled ?? clientToUpdate.isEnabled,
      );

      if (!updatedClient) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedClient, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
