import { Handlers } from "$fresh/server.ts";
import { enableClient, getClientById } from "../../../models/client.ts";
import {
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const client = await getClientById(ctx.params.id);
      if (!client) {
        return httpResponse404NotFound();
      }
      await enableClient(ctx.params.id, ctx.state.userId as number);
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
