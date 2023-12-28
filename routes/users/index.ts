import { Handlers } from "$fresh/server.ts";
import { getAllUsers, insertUser } from "../../models/user.ts";
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
      id: { type: "integer" },
      name: { type: "string" },
      emailAddress: { type: "string", format: "email" },
      isEnabled: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      deletedAt: { type: ["string", "null"], format: "date-time" },
    },
    required: [
      "id",
      "name",
      "emailAddress",
      "isEnabled",
      "createdAt",
      "updatedAt",
    ],
  },
};

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    emailAddress: { type: "string", format: "email" },
    password: { type: "string", minLength: 6 },
    isEnabled: { type: "boolean" },
  },
  required: ["name", "emailAddress", "password", "isEnabled"],
  additionalProperties: false,
};

export const POST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    emailAddress: { type: "string" },
    email: { type: "string" },
    isEnabled: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
      nullable: true,
    },
  },
  required: [
    "id",
    "name",
    "emailAddress",
    "isEnabled",
    "createdAt",
    "updatedAt",
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
        emailAddress: string;
        password: string;
        isEnabled: boolean;
      };
      const validRequest = postRequestValidator(user);

      if (!validRequest) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const result = await insertUser(
        user.name,
        user.emailAddress,
        user.password,
        user.isEnabled,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
