import { Handlers } from "$fresh/server.ts";
import { getAllGroups, type Group, insertGroup } from "../../models/group.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const groups = await getAllGroups();
      return httpJsonResponse(groups, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },

  async POST(req, _ctx) {
    try {
      const group = await req.json() as Group;
      const result = await insertGroup(
        group.name,
      );

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
