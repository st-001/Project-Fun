import { Handlers } from "$fresh/server.ts";
import { getUserById, resetUserPassword } from "../../../models/user.ts";
import {
  httpJsonResponse,
  httpResponse204NoContent,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";
import ajv from "../../../ajv.ts";

export const PUT_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    newPassword: { type: "string", minLength: 6 },
  },
  required: ["newPassword"],
  additionalProperties: false,
};

const putRequestValidator = ajv.compile(PUT_REQUEST_SCHEMA);

export const handler: Handlers = {
  async PUT(req, ctx) {
    try {
      const user = await getUserById(ctx.params.id);
      if (!user) {
        return httpResponse404NotFound();
      }

      const requestBody = await req.json();
      const validRequest = putRequestValidator(requestBody);

      if (!validRequest) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const { newPassword } = requestBody as { newPassword: string };

      const resetPasswordSuccess = await resetUserPassword(
        user.id,
        newPassword,
      );

      if (!resetPasswordSuccess) {
        return httpResponse500InternalServerError("Failed to reset password.");
      }

      return httpResponse204NoContent();
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
