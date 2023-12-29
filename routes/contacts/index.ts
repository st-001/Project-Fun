import { Handlers } from "$fresh/server.ts";
import { getAllContacts, insertContact } from "../../models/contact.ts";
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
      emailAddress: {
        type: "string",
      },
      jobTitle: {
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
        required: ["id", "name"],
        additionalProperties: false,
      },
    },
    required: [
      "id",
      "name",
      "isEnabled",
      "emailAddress",
      "jobTitle",
      "createdAt",
      "updatedAt",
      "client",
    ],
    additionalProperties: false,
  },
};

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    emailAddress: { type: "string", maxLength: 255, minLength: 1 },
    jobTitle: { type: "string", maxLength: 255, minLength: 1 },
    clientId: { type: "number" },
    isEnabled: { type: "boolean" },
  },
  required: ["name", "emailAddress", "clientId", "isEnabled"],
  additionalProperties: false,
};

export const POST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    emailAddress: { type: "string" },
    jobTitle: { type: "string" },
    isEnabled: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
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
      required: ["id", "name"],
      additionalProperties: false,
    },
  },
  required: [
    "id",
    "name",
    "isEnabled",
    "emailAddress",
    "jobTitle",
    "createdAt",
    "updatedAt",
    "client",
  ],
  additionalProperties: false,
};

const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const contacts = await getAllContacts();
      return httpJsonResponse(contacts, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, ctx) {
    try {
      const contact = await req.json() as {
        name: string;
        emailAddress: string;
        jobTitle: string;
        clientId: number;
        isEnabled: boolean;
      };

      if (!postRequestValidator(contact)) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertContact(
        contact.name,
        contact.isEnabled,
        contact.emailAddress,
        contact.jobTitle,
        contact.clientId,
        ctx.state.userId as number,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
