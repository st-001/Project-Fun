import { Handlers } from "$fresh/server.ts";
import { getClientById, updateClient } from "../../../models/client.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const client = await getClientById(ctx.params.id);
      if (!client) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(client, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async PUT(req, ctx) {
    try {
      const clientId = ctx.params.id;
      const clientToUpdate = await getClientById(clientId);

      if (!clientToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json();
      const updatedClient = await updateClient(
        clientId,
        updateData.name ?? clientToUpdate.name,
        updateData.isEnabled ?? clientToUpdate.isEnabled,
      );

      if (!updatedClient) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedClient, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
