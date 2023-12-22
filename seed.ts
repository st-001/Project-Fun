import { insertGroup } from "./models/group.ts";
import { insertUser } from "./models/user.ts";

const group = await insertGroup("Administrators");

const user = await insertUser(
  "Administrator",
  "administrator@localhost.com",
  "password",
  group.id,
);

console.log(group);
console.log(user);
Deno.exit(0);
