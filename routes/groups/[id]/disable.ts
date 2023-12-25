import { Handlers } from "$fresh/server.ts";
import { disableGroup, getGroupById } from "../../../models/group.ts";
import {
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);
      if (!group) {
        return httpResponse404NotFound();
      }
      await disableGroup(ctx.params.id, ctx.state.userId as number);
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
