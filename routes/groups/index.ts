import { Handlers } from "$fresh/server.ts";
import { getAllGroups, type Group, insertGroup } from "../../models/group.ts";
import { jsonResponse } from "../../utils.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const users = await getAllGroups();
      return jsonResponse(users);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },

  async POST(req, _ctx) {
    try {
      const group = await req.json() as Group;
      const result = await insertGroup(
        group.name,
      );

      return jsonResponse(result, 201);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },
};
