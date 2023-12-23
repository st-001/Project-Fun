import { Handlers } from "$fresh/server.ts";
import { enableProject, getProjectById } from "../../../models/project.ts";
import {
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const project = await getProjectById(ctx.params.id);
      if (!project) {
        return httpResponse404NotFound();
      }
      await enableProject(ctx.params.id);
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
