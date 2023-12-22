import { Handlers } from "$fresh/server.ts";
import { disableClient, getClientById } from "../../../models/client.ts";
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
      await disableClient(ctx.params.id);
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
