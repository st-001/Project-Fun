import { Handlers } from "$fresh/server.ts";
import { enableGroup, getGroupById } from "../../../models/group.ts";
import { jsonResponse } from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const group = await getGroupById(ctx.params.id);
      if (!group) {
        return jsonResponse({ error: "Not Found" }, 404);
      }
      await enableGroup(ctx.params.id);
      return jsonResponse(null, 204);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },
};
