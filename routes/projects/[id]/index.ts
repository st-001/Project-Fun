import { Handlers } from "$fresh/server.ts";
import { getProjectById, updateProject } from "../../../models/project.ts";
import {
  httpJsonResponse,
  httpResponse404NotFound,
  httpResponse500InternalServerError,
} from "../../../utils.ts";
import ajv from "../../../ajv.ts";

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
      const project = await getProjectById(ctx.params.id);
      if (!project) {
        return httpResponse404NotFound();
      }
      return httpJsonResponse(project, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
  async PUT(req, ctx) {
    try {
      const projectId = ctx.params.id;
      const projectToUpdate = await getProjectById(projectId);

      if (!projectToUpdate) {
        return httpResponse404NotFound();
      }

      const updateData = await req.json() as {
        name?: string;
        isEnabled?: boolean;
      };

      if (!putRequestValidator(updateData)) {
        return httpJsonResponse(putRequestValidator.errors, 400);
      }

      const updatedProject = await updateProject(
        projectId,
        updateData.name ?? projectToUpdate.name,
        updateData.isEnabled ?? projectToUpdate.isEnabled,
      );

      if (!updatedProject) {
        return httpResponse404NotFound();
      }

      return httpJsonResponse(updatedProject, 200);
    } catch (error) {
      return httpResponse500InternalServerError(error);
    }
  },
};
