import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { Handlers } from "$fresh/server.ts";
import { getUserByEmail } from "../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse401Unauthorized,
  httpResponse500InternalServerError,
} from "../../utils.ts";
import { signJwt } from "../../jwt.ts";
import ajv from "../../ajv.ts";

export const POST_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    emailAddress: { type: "string", format: "email" },
    password: { type: "string" },
  },
  required: ["emailAddress", "password"],
  additionalProperties: false,
};

export const POST_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    accessToken: { type: "string" },
  },
  required: [
    "accessToken",
  ],
  additionalProperties: false,
};

const postRequestValidator = ajv.compile(POST_REQUEST_SCHEMA);

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      const body = await req.json() as {
        password: string;
        emailAddress: string;
      };

      if (!postRequestValidator(body)) {
        return httpJsonResponse(postRequestValidator.errors, 400);
      }

      const user = await getUserByEmail(body.emailAddress);
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
        { id: user.id, email: user.emailAddress },
        Deno.env.get("JWT_SECRET")!,
      );

      return httpJsonResponse({ accessToken }, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
