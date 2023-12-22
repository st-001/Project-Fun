import { Handlers } from "$fresh/server.ts";
import { getUserById } from "../../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

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
};
