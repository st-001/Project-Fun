import { Handlers } from "$fresh/server.ts";
import { getUserById, updateUser } from "../../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";
import ajv from "../../../ajv.ts";

export const PUT_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    email: { type: "string", format: "email" },
    primaryGroupId: { type: "number" },
    isEnabled: { type: "boolean" },
  },
  additionalProperties: false,
};

export const PUT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    email: { type: "string" },
    primaryGroup: {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
      required: ["id", "name"],
    },
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
    "email",
    "primaryGroup",
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
        name?: string;
        email?: string;
        primaryGroupId?: number;
        isEnabled?: boolean;
      };

      if (!putRequestValidator(updateData)) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const updatedUser = await updateUser(
        userId,
        updateData.name ?? userToUpdate.name,
        updateData.email ?? userToUpdate.email,
        updateData.primaryGroupId ?? userToUpdate.primaryGroupId!,
        typeof updateData.isEnabled === "boolean"
          ? updateData.isEnabled
          : userToUpdate.isEnabled,
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
