import { Handlers } from "$fresh/server.ts";
import { disableTask, getTaskById } from "../../../models/task.ts";
import {
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const task = await getTaskById(ctx.params.id);
      if (!task) {
        return httpResponse404NotFound();
      }
      await disableTask(ctx.params.id);
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
