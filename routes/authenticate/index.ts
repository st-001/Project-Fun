import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Handlers } from "$fresh/server.ts";
import { getUserByEmail } from "../../models/user.ts";
import { jsonResponse } from "../../utils.ts";
import { signJwt } from "../../jwt.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const body = await req.json() as { password: string; email: string };
      const user = await getUserByEmail(body.email);
      if (!user) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }

      if (!user.isEnabled) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }

      const isValidPassword = await bcrypt.compare(
        body.password,
        user.passwordHash!,
      );

      if (!isValidPassword) {
        return jsonResponse({ error: "Unauthorized" }, 401);
      }

      const accessToken = await signJwt(
        { id: user.id, email: user.email },
        Deno.env.get("JWT_SECRET")!,
      );

      return jsonResponse({ accessToken }, 201);
    } catch (error) {
      return jsonResponse({ error }, 500);
    }
  },
};
