import { Handlers } from "$fresh/server.ts";
import { getContactById, updateContact } from "../../../models/contact.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";
import ajv from "../../../ajv.ts";

export const GET_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: {
      type: "integer",
    },
    name: {
      type: "string",
    },
    emailAddress: {
      type: "string",
    },
    isEnabled: {
      type: "boolean",
    },
    createdAt: {
      type: "string",
      format: "date-time",
    },
    updatedAt: {
      type: "string",
      format: "date-time",
    },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
    },
  },
  required: ["id", "name", "isEnabled", "createdAt", "updatedAt"],
};

export const PUT_REQUEST_SCHEMA = {
  type: "object",
  properties: {
    name: { type: "string", maxLength: 255, minLength: 1 },
    isEnabled: { type: "boolean" },
  },
  required: ["name", "isEnabled"],
  additionalProperties: false,
};

export const PUT_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "number" },
    name: { type: "string" },
    emailAddress: { type: "string" },
    isEnabled: { type: "boolean" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
    deletedAt: {
      type: ["string", "null"],
      format: "date-time",
    },
  },
  required: ["id", "name", "isEnabled", "createdAt", "updatedAt"],
  additionalProperties: false,
};

const putRequestValidator = ajv.compile(PUT_REQUEST_SCHEMA);

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const contact = await getContactById(ctx.params.id);
      if (!contact) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(contact, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async PUT(req, ctx) {
    try {
      const contactId = ctx.params.id;
      const contactToUpdate = await getContactById(contactId);

      if (!contactToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json() as {
        name?: string;
        isEnabled?: boolean;
        emailAddress?: string;
      };

      if (!putRequestValidator(updateData)) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const updatedContact = await updateContact(
        contactId,
        updateData.name ?? contactToUpdate.name,
        updateData.emailAddress ?? contactToUpdate.emailAddress,
        updateData.isEnabled ?? contactToUpdate.isEnabled,
      );

      if (!updatedContact) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedContact, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};