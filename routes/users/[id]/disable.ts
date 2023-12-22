import { Handlers } from "$fresh/server.ts";
import { disableUser, getUserById } from "../../../models/user.ts";
import {
  httpResponse204Created,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const user = await getUserById(ctx.params.id);
      if (!user) {
        return httpResponse404NotFound();
      }
      await disableUser(ctx.params.id);
      return httpResponse204Created();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
