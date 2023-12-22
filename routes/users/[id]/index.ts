import { Handlers } from "$fresh/server.ts";
import { getUserById } from "../../../models/user.ts";
import { jsonResponse } from "../../../utils.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const user = await getUserById(ctx.params.id);
      if (!user) {
        return jsonResponse({ error: "Not Found" }, 404);
      }
      return jsonResponse(user);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },
};
