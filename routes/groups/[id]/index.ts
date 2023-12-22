import { Handlers } from "$fresh/server.ts";
import { getGroupById } from "../../../models/group.ts";
import { jsonResponse } from "../../../utils.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);
      if (!group) {
        return jsonResponse({ error: "Not Found" }, 404);
      }
      return jsonResponse(group);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },
};
