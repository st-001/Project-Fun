import { Handlers } from "$fresh/server.ts";
import { getAllUsers, insertUser } from "../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";
import ajv from "../../ajv.ts";

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
    primaryGroupId: { type: "number" },
  },
  required: ["name", "email", "password", "primaryGroupId"],
  additionalProperties: false,
};

export const POST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
    primaryGroupId: { type: "number" },
    isEnabled: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
      nullable: true,
    },
    primaryGroup: {
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
          nullable: true,
        },
      },
      required: ["id", "name"],
    },
  },
  required: [
    "id",
    "name",
    "email",
    "primaryGroupId",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "primaryGroup",
  ],
  additionalProperties: false,
};

const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const users = await getAllUsers();
      return httpJsonResponse(users);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, _ctx) {
    try {
      const user = await req.json() as {
        name: string;
        email: string;
        password: string;
        primaryGroupId: number;
      };
      const validRequest = postRequestValidator(user);

      if (!validRequest) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertUser(
        user.name,
        user.email,
        user.password,
        user.primaryGroupId,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
