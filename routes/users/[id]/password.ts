import { Handlers } from "$fresh/server.ts";
import { getUserById, resetUserPassword } from "../../../models/user.ts";
import {
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
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
        return httpResponse500InternalServerError("Failed to reset password.");
      }

      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
