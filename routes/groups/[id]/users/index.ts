import { Handlers } from "$fresh/server.ts";
import {
  addUserToGroup,
  getGroupById,
  getGroupUsers,
} from "../../../../models/group.ts";
import {
  httpJsonResponse,
  httpResponse201Created,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../../utils.ts";
import ajv from "../../../../ajv.ts";

export const GET_RESPONSE_SCHEMA = {
  type: "array",
  items: {
    type: "object",
    properties: {
      id: { type: "integer" },
      name: { type: "string" },
      email: { type: "string", format: "email" },
      primaryGroupId: { type: "integer" },
      isEnabled: { type: "boolean" },
      createdAt: { type: "string", format: "date-time" },
      updatedAt: { type: "string", format: "date-time" },
      deletedAt: { type: ["string", "null"], format: "date-time" },
    },
    required: [
      "id",
      "name",
      "email",
      "primaryGroupId",
      "isEnabled",
      "createdAt",
      "updatedAt",
    ],
  },
};

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    userId: { type: "integer" },
  },
  required: ["userId"],
};

const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);
      if (!group) {
        return httpResponse404NotFound();
      }

      const users = await getGroupUsers(group.id);

      return httpJsonResponse(users, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async POST(req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);
      if (!group) {
        return httpResponse404NotFound();
      }

      const requestBody = await req.json() as { userId: number };

      if (!postRequestValidator(requestBody)) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const { userId } = requestBody;

      await addUserToGroup(userId, group.id);

      return httpResponse201Created();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
