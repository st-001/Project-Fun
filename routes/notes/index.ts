import { Handlers } from "$fresh/server.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";
import ajv from "../../ajv.ts";
import { insertNote, Note } from "../../models/note.ts";

export const GET_QUERY_SCHEMA = {
  type: "object",
  properties: {
    entityType: {
      type: "string",
      enum: ["user", "group", "project", "task", "client", "contact"],
    },
    entityId: {
      type: "number",
    },
  },
  required: ["entityType", "entityId"],
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
      entityType: {
        type: "string",
        enum: ["user", "group", "project", "task", "client", "contact"],
      },
      entityId: {
        type: "integer",
      },
      content: {
        type: "string",
      },
      createdAt: {
        type: "string",
        format: "date-time",
      },
      createdBy: {
        type: "object",
        properties: {
          id: { type: "number" },
          name: { type: "string" },
          emailAddress: { type: "string" },
        },
        required: ["id", "name", "emailAddress"],
        additionalProperties: false,
      },
    },
    required: [
      "id",
      "entityType",
      "entityId",
      "content",
      "createdAt",
      "createdBy",
    ],
    additionalProperties: false,
  },
};

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    entityType: {
      type: "string",
      enum: ["user", "group", "project", "task", "client", "contact"],
    },
    entityId: {
      type: "number",
    },
    content: {
      type: "string",
    },
    createdById: {
      type: "number",
    },
  },
  required: ["entityType", "entityId", "content", "createdById"],
  additionalProperties: false,
};

export const POST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    entityType: {
      type: "string",
      enum: ["user", "group", "project", "task", "client", "contact"],
    },
    entityId: {
      type: "number",
    },
    content: {
      type: "string",
    },
    createdAt: { type: "string", format: "date-time" },
    createdBy: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
        emailAddress: { type: "string" },
      },
      required: ["id", "name", "emailAddress"],
      additionalProperties: false,
    },
  },
  required: [
    "id",
    "entityType",
    "entityId",
    "content",
    "createdAt",
    "createdBy",
  ],
  additionalProperties: false,
};

const getQueryValidator = ajv.compile(GET_QUERY_SCHEMA);
const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(req, _ctx) {
    try {
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams);

      if (!getQueryValidator(queryParams)) {
        return httpJsonResponse(getQueryValidator.errors, 400);
      }

      return httpJsonResponse({}, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async POST(req, ctx) {
    try {
      const note = await req.json() as Note;

      if (!postRequestValidator(note)) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertNote(
        note.entityType,
        note.entityId,
        note.content,
        ctx.state.userId as number,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
