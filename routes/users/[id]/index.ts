import { Handlers } from "$fresh/server.ts";
import { getUserById, updateUser } from "../../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";
import ajv from "../../../ajv.ts";

export const GET_RESPONSE_SCHEMA = {
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
};

export const PUT_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    emailAddress: { type: "string", format: "email" },
    isEnabled: { type: "boolean" },
  },
  required: ["name", "emailAddress", "isEnabled"],
  additionalProperties: false,
};

export const PUT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    emailAddress: { type: "string" },
    isEnabled: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
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

const putRequestValidator = ajv.compile(PUT_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const user = await getUserById(ctx.params.id);
      if (!user) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(user, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async PUT(req, ctx) {
    try {
      const userId = ctx.params.id;
      const userToUpdate = await getUserById(userId);

      if (!userToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json() as {
        name: string;
        emailAddress: string;
        isEnabled: boolean;
      };

      if (!putRequestValidator(updateData)) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const updatedUser = await updateUser(
        userId,
        updateData.name,
        updateData.emailAddress,
        updateData.isEnabled,
      );

      if (!updatedUser) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedUser, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
