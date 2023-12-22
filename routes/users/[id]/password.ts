import { Handlers } from "$fresh/server.ts";
import { getUserById, resetUserPassword } from "../../../models/user.ts";
import {
  httpResponse204Created,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
  jsonResponse,
} from "../../../utils.ts";

export const handler: Handlers = {
  async PUT(req, ctx) {
    try {
      const user = await getUserById(ctx.params.id);
      if (!user) {
        return httpResponse404NotFound();
      }

      const { newPassword } = await req.json() as { newPassword: string };

      const resetPasswordSuccess = await resetUserPassword(
        user.id,
        newPassword,
      );

      if (!resetPasswordSuccess) {
        return jsonResponse({ error: "Failed to reset password" }, 500);
      }

      return httpResponse204Created();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
