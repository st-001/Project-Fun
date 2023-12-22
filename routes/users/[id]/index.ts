import { Handlers } from "$fresh/server.ts";
import { getUserById, updateUser } from "../../../models/user.ts";
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
  async PUT(req, ctx) {
    try {
      const userId = ctx.params.id;
      const userToUpdate = await getUserById(userId);

      if (!userToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json();
      const updatedUser = await updateUser(
        userId,
        updateData.name ?? userToUpdate.name,
        updateData.email ?? userToUpdate.email,
        updateData.primaryGroupId ?? userToUpdate.primaryGroupId!,
        updateData.isEnabled ?? userToUpdate.isEnabled,
      );

      if (!updatedUser) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedUser, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
