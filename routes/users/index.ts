import { Handlers } from "$fresh/server.ts";
import { getAllUsers, insertUser, type User } from "../../models/user.ts";
import { jsonResponse } from "../../utils.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const users = await getAllUsers();
      return jsonResponse(users);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },

  async POST(req, _ctx) {
    try {
      const user = await req.json() as User;
      const result = await insertUser(
        user.fullName,
        user.email,
        user.password!,
        user.primaryGroupId!,
      );

      return jsonResponse(result, 201);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },
};
