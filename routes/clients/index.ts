import { Handlers } from "$fresh/server.ts";
import {
  type Client,
  getAllClients,
  insertClient,
} from "../../models/client.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const clients = await getAllClients();
      return httpJsonResponse(clients, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, _ctx) {
    try {
      const client = await req.json() as Client;
      const result = await insertClient(
        client.name,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
