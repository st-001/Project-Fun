import sql from "../db.ts";

export interface Contact {
  id: number;
  name: string;
  emailAddress: string;
  isEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export async function insertContact(
  name: string,
  isEnabled: boolean,
  emailAddress: string,
) {
  const result = await sql`
    insert into contact
      (name , is_enabled, email_address)
    values
      (${name}, ${isEnabled}, ${emailAddress})
    returning 
    id, 
    name,
    email_address as "emailAddress",
    is_enabled as "isEnabled",
    created_at as "createdAt",
    updated_at as "updatedAt",
    deleted_at as "deletedAt"
  `;
  return result[0] as Contact;
}

export async function updateContact(
  contactId: number | string,
  name: string,
  emailAddress: string,
  isEnabled: boolean,
) {
  const result = await sql`
    update contact
    set
      name = ${name},
      email_address = ${emailAddress},
      is_enabled = ${isEnabled},
      updated_at = now()
    where
      id = ${contactId}
    returning 
      id,
      name,
      email_address as "emailAddress",
      is_enabled as "isEnabled",
      created_at as "createdAt",
      updated_at as "updatedAt",
      deleted_at as "deletedAt"
  `;
  return result[0] as Contact;
}

export async function getContactById(id: number | string) {
  const result = await sql`
    SELECT
    id,
    name,
    email_address AS "emailAddress",
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM contact
    WHERE id = ${id}
  `;
  return result[0] as Contact;
}

export async function getAllContacts() {
  const result = await sql`
    SELECT
    id,
    name,
    email_address AS "emailAddress",
    is_enabled AS "isEnabled",
    created_at AS "createdAt",
    updated_at AS "updatedAt",
    deleted_at AS "deletedAt"
    FROM contact
  `;

  return result.map((x) => x as Contact);
}

export async function enableContact(contactId: number | string) {
  await sql`
    UPDATE contact
    SET is_enabled = true,
    updated_at = now()
    WHERE id = ${contactId}
  `;
}

export async function disableContact(contactId: number | string) {
  await sql`
    UPDATE contact
    SET is_enabled = false,
    updated_at = now()
    WHERE id = ${contactId}
  `;
}
