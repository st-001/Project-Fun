import sql from "../db.ts";
import { type Client, getClientById } from "./client.ts";

export interface Contact {
  id: number;
  name: string;
  emailAddress: string;
  jobTitle: string;
  client: Client;
  clientId?: number | string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertContact(
  name: string,
  isEnabled: boolean,
  emailAddress: string,
  jobTitle: string,
  clientId: number | string,
  createdById: number,
) {
  const insertResult = await sql`
    INSERT INTO contact
      (name, is_enabled, email_address, job_title, client_id, created_by, updated_by)
    VALUES
      (${name}, ${isEnabled}, ${emailAddress}, ${jobTitle}, ${clientId}, ${createdById}, ${createdById})
    RETURNING 
      id, 
      name,
      email_address AS "emailAddress",
      job_title AS "jobTitle",
      client_id AS "clientId",
      is_enabled AS "isEnabled",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      deleted_at AS "deletedAt"
  `;

  const contact = insertResult[0] as Contact;
  if (contact) {
    const client = await getClientById(clientId);
    return { ...contact, client };
  }

  return null;
}

export async function updateContact(
  contactId: number | string,
  name: string,
  emailAddress: string,
  jobTitle: string,
  clientId: number | string,
  isEnabled: boolean,
  updatedById: number,
) {
  const updateResult = await sql`
    UPDATE contact
    SET
      name = ${name},
      email_address = ${emailAddress},
      job_title = ${jobTitle},
      client_id = ${clientId},
      is_enabled = ${isEnabled},
      updated_at = now(),
      updated_by = ${updatedById}
    WHERE
      id = ${contactId}
    RETURNING 
      id,
      name,
      email_address AS "emailAddress",
      client_id AS "clientId",
      is_enabled AS "isEnabled",
      created_at AS "createdAt",
      updated_at AS "updatedAt",
      deleted_at AS "deletedAt"
  `;

  const contact = updateResult[0] as Contact;
  if (contact) {
    const client = await getClientById(clientId);
    return { ...contact, client };
  }

  return null;
}

export async function getContactById(id: number | string) {
  const result = await sql`
    SELECT
      contact.id,
      contact.name,
      contact.email_address AS "emailAddress",
      contact.job_title AS "jobTitle",
      contact.is_enabled AS "isEnabled",
      contact.created_at AS "createdAt",
      contact.updated_at AS "updatedAt",
      contact.deleted_at AS "deletedAt",
      client.id AS "clientId",
      client.name AS "clientName"
    FROM
      contact
    INNER JOIN client ON contact.client_id = client.id
    WHERE contact.id = ${id}
  `;

  if (result.length === 0) {
    return null;
  }

  return {
    id: result[0].id,
    name: result[0].name,
    emailAddress: result[0].emailAddress,
    jobTitle: result[0].jobTitle,
    isEnabled: result[0].isEnabled,
    createdAt: result[0].createdAt,
    updatedAt: result[0].updatedAt,
    deletedAt: result[0].deletedAt,
    client: {
      id: result[0].clientId,
      name: result[0].clientName,
    },
  } as Contact;
}

export async function getAllContacts(
  options: {
    clientId?: number;
    isEnabled?: boolean;
  } = {},
) {
  const { clientId, isEnabled } = options;

  const result = await sql`
    SELECT
      contact.id,
      contact.name,
      contact.email_address AS "emailAddress",
      contact.job_title AS "jobTitle",
      contact.is_enabled AS "isEnabled",
      contact.created_at AS "createdAt",
      contact.updated_at AS "updatedAt",
      contact.deleted_at AS "deletedAt",
      client.id AS "clientId",
      client.name AS "clientName"
    FROM
      contact
    INNER JOIN client ON contact.client_id = client.id
    WHERE
      1 = 1
      ${clientId ? sql`AND contact.client_id = ${clientId}` : sql``}
      ${
    typeof isEnabled !== "undefined"
      ? sql`AND contact.is_enabled = ${isEnabled}`
      : sql``
  }
  `;

  return result.map((contact) => ({
    ...contact,
    client: {
      id: contact.clientId,
      name: contact.clientName,
    },
  } as Contact));
}

export async function enableContact(
  contactId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE contact
    SET is_enabled = true,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${contactId}
  `;
}

export async function disableContact(
  contactId: number | string,
  updatedById: number,
) {
  await sql`
    UPDATE contact
    SET is_enabled = false,
    updated_by = ${updatedById},
    updated_at = now()
    WHERE id = ${contactId}
  `;
}
