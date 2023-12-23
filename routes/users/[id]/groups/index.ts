import { Handlers } from "$fresh/server.ts";
import { getUserGroups } from "../../../../models/group.ts";
import { getUserById } from "../../../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../../utils.ts";

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

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const user = await getUserById(ctx.params.id);
      if (!user) {
        return httpResponse404NotFound();
      }

      const groups = await getUserGroups(user.id);

      return httpJsonResponse(groups, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
