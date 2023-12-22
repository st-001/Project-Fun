import { Handlers } from "$fresh/server.ts";
import { getAllUsers, insertUser, type User } from "../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse500InternalServerError,
} from "../../utils.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const users = await getAllUsers();
      return httpJsonResponse(users);
    } catch (error) {
      return httpResponse500InternalServerError(error);
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

      return httpJsonResponse(result, 201);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
