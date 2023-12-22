import { Handlers } from "$fresh/server.ts";
import { getGroupById, updateGroup } from "../../../models/group.ts";
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
  async PUT(req, ctx) {
    try {
      const groupId = ctx.params.id;
      const groupToUpdate = await getGroupById(groupId);

      if (!groupToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json();
      const updatedGroup = await updateGroup(
        groupId,
        updateData.name ?? groupToUpdate.name,
        updateData.isEnabled ?? groupToUpdate.isEnabled,
      );

      if (!updatedGroup) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedGroup, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
