import { Handlers } from "$fresh/server.ts";
import { disableContact, getContactById } from "../../../models/contact.ts";
import {
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async POST(_req, ctx) {
    try {
      const contact = await getContactById(ctx.params.id);
      if (!contact) {
        return httpResponse404NotFound();
      }
      await disableContact(ctx.params.id);
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
