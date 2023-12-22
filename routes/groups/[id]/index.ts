import { Handlers } from "$fresh/server.ts";
import { getGroupById } from "../../../models/group.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);
      if (!group) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(group, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
