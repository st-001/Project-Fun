import { Handlers } from "$fresh/server.ts";
import { getGroupById, removeUserFromGroup } from "../../../../models/group.ts";
import { getUserById } from "../../../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../../utils.ts";

export const handler: Handlers = {
  async DELETE(_req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);

      if (!group) {
        return httpResponse404NotFound();
      }

      const user = await getUserById(ctx.params.userId);

      if (!user) {
        return httpResponse404NotFound();
      }

      if (user.primaryGroupId === group.id) {
        return httpJsonResponse({
          error: "Cannot remove user from their primary group.",
        }, 400);
      }

      await removeUserFromGroup(user.id, group.id);

      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
