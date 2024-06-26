// DO NOT EDIT. This file is generated by Fresh.
// This file SHOULD be checked into source version control.
// This file is automatically updated during development when running `dev.ts`.

import * as $_middleware from "./routes/_middleware.ts";
import * as $assistant_index from "./routes/assistant/index.ts";
import * as $authenticate_index from "./routes/authenticate/index.ts";
import * as $clients_id_disable from "./routes/clients/[id]/disable.ts";
import * as $clients_id_enable from "./routes/clients/[id]/enable.ts";
import * as $clients_id_index from "./routes/clients/[id]/index.ts";
import * as $clients_index from "./routes/clients/index.ts";
import * as $contacts_id_disable from "./routes/contacts/[id]/disable.ts";
import * as $contacts_id_enable from "./routes/contacts/[id]/enable.ts";
import * as $contacts_id_index from "./routes/contacts/[id]/index.ts";
import * as $contacts_index from "./routes/contacts/index.ts";
import * as $groups_id_disable from "./routes/groups/[id]/disable.ts";
import * as $groups_id_enable from "./routes/groups/[id]/enable.ts";
import * as $groups_id_index from "./routes/groups/[id]/index.ts";
import * as $groups_id_users_userId_ from "./routes/groups/[id]/users/[userId].ts";
import * as $groups_id_users_index from "./routes/groups/[id]/users/index.ts";
import * as $groups_index from "./routes/groups/index.ts";
import * as $notes_index from "./routes/notes/index.ts";
import * as $projects_id_disable from "./routes/projects/[id]/disable.ts";
import * as $projects_id_enable from "./routes/projects/[id]/enable.ts";
import * as $projects_id_index from "./routes/projects/[id]/index.ts";
import * as $projects_index from "./routes/projects/index.ts";
import * as $tasks_id_disable from "./routes/tasks/[id]/disable.ts";
import * as $tasks_id_enable from "./routes/tasks/[id]/enable.ts";
import * as $tasks_id_index from "./routes/tasks/[id]/index.ts";
import * as $tasks_index from "./routes/tasks/index.ts";
import * as $users_id_disable from "./routes/users/[id]/disable.ts";
import * as $users_id_enable from "./routes/users/[id]/enable.ts";
import * as $users_id_groups_index from "./routes/users/[id]/groups/index.ts";
import * as $users_id_index from "./routes/users/[id]/index.ts";
import * as $users_id_password from "./routes/users/[id]/password.ts";
import * as $users_index from "./routes/users/index.ts";
import * as $verify_access_token_index from "./routes/verify-access-token/index.ts";

import { type Manifest } from "$fresh/server.ts";

const manifest = {
  routes: {
    "./routes/_middleware.ts": $_middleware,
    "./routes/assistant/index.ts": $assistant_index,
    "./routes/authenticate/index.ts": $authenticate_index,
    "./routes/clients/[id]/disable.ts": $clients_id_disable,
    "./routes/clients/[id]/enable.ts": $clients_id_enable,
    "./routes/clients/[id]/index.ts": $clients_id_index,
    "./routes/clients/index.ts": $clients_index,
    "./routes/contacts/[id]/disable.ts": $contacts_id_disable,
    "./routes/contacts/[id]/enable.ts": $contacts_id_enable,
    "./routes/contacts/[id]/index.ts": $contacts_id_index,
    "./routes/contacts/index.ts": $contacts_index,
    "./routes/groups/[id]/disable.ts": $groups_id_disable,
    "./routes/groups/[id]/enable.ts": $groups_id_enable,
    "./routes/groups/[id]/index.ts": $groups_id_index,
    "./routes/groups/[id]/users/[userId].ts": $groups_id_users_userId_,
    "./routes/groups/[id]/users/index.ts": $groups_id_users_index,
    "./routes/groups/index.ts": $groups_index,
    "./routes/notes/index.ts": $notes_index,
    "./routes/projects/[id]/disable.ts": $projects_id_disable,
    "./routes/projects/[id]/enable.ts": $projects_id_enable,
    "./routes/projects/[id]/index.ts": $projects_id_index,
    "./routes/projects/index.ts": $projects_index,
    "./routes/tasks/[id]/disable.ts": $tasks_id_disable,
    "./routes/tasks/[id]/enable.ts": $tasks_id_enable,
    "./routes/tasks/[id]/index.ts": $tasks_id_index,
    "./routes/tasks/index.ts": $tasks_index,
    "./routes/users/[id]/disable.ts": $users_id_disable,
    "./routes/users/[id]/enable.ts": $users_id_enable,
    "./routes/users/[id]/groups/index.ts": $users_id_groups_index,
    "./routes/users/[id]/index.ts": $users_id_index,
    "./routes/users/[id]/password.ts": $users_id_password,
    "./routes/users/index.ts": $users_index,
    "./routes/verify-access-token/index.ts": $verify_access_token_index,
  },
  islands: {},
  baseUrl: import.meta.url,
} satisfies Manifest;

export default manifest;
