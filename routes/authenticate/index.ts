import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Handlers } from "$fresh/server.ts";
import { getUserByEmail } from "../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse401Unauthorized,
  httpResponse500InternalServerError,
} from "../../utils.ts";
import { signJwt } from "../../jwt.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const body = await req.json() as { password: string; email: string };
      const user = await getUserByEmail(body.email);
      if (!user) {
        return httpResponse401Unauthorized();
      }

      if (!user.isEnabled) {
        return httpResponse401Unauthorized();
      }

      const isValidPassword = await bcrypt.compare(
        body.password,
        user.passwordHash!,
      );

      if (!isValidPassword) {
        return httpResponse401Unauthorized();
      }

      const accessToken = await signJwt(
        { id: user.id, email: user.email },
        Deno.env.get("JWT_SECRET")!,
      );

      return httpJsonResponse({ accessToken }, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
