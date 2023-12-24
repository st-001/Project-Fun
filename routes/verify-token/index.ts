import { Handlers } from "$fresh/server.ts";
import {
  httpResponse204NoContent,
  httpResponse500InternalServerError,
} from "../../utils.ts";

export const handler: Handlers = {
  // deno-lint-ignore require-await
  async GET(_req, _ctx) {
    try {
      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
