// import sql from "./db.ts";
// import { insertGroup } from "./models/group.ts";
import { insertGroup } from "./models/group.ts";
import { insertUser } from "./models/user.ts";
// import { generateSecret } from "./jwt.ts";

// const postgresConnectionString =
//   "postgres://postgres:password@localhost:5432/project";

// await sql.begin(async (sql) => {
//   await sql`DROP TABLE IF EXISTS user_group CASCADE`;
//   await sql`DROP TABLE IF EXISTS users CASCADE`;
//   await sql`DROP TABLE IF EXISTS groups CASCADE`;
//   await sql`DROP TABLE IF EXISTS client CASCADE`;

//   await sql`CREATE TABLE groups (
//         id serial NOT NULL,
//         name varchar(255) NOT NULL,
//         is_enabled boolean NOT NULL DEFAULT true,
//         created_at timestamp with time zone NOT NULL DEFAULT now(),
//         updated_at timestamp with time zone NOT NULL DEFAULT now(),
//         deleted_at timestamp with time zone,
//         UNIQUE (name),
//         PRIMARY KEY (id)
//     )`;

//   await sql`CREATE TABLE users (
//         id serial NOT NULL,
//         name varchar(255) NOT NULL,
//         email_address varchar(255) NOT NULL,
//         password_hash varchar(255) NOT NULL,
//         primary_group_id int NOT NULL,
//         is_enabled boolean NOT NULL DEFAULT true,
//         created_at timestamp with time zone NOT NULL DEFAULT now(),
//         updated_at timestamp with time zone NOT NULL DEFAULT now(),
//         deleted_at timestamp with time zone,
//         PRIMARY KEY (id),
//         UNIQUE (email),
//         FOREIGN KEY (primary_group_id) REFERENCES groups(id)
//     )`;

//   await sql`CREATE TABLE user_group (
//         user_id int NOT NULL,
//         group_id int NOT NULL,
//         PRIMARY KEY (user_id, group_id),
//         FOREIGN KEY (user_id) REFERENCES users(id),
//         FOREIGN KEY (group_id) REFERENCES groups(id)
//     )`;

//   await sql`CREATE TABLE client (
//         id serial NOT NULL,
//         name varchar(255) NOT NULL,
//         is_enabled boolean NOT NULL DEFAULT true,
//         created_at timestamp with time zone NOT NULL DEFAULT now(),
//         updated_at timestamp with time zone NOT NULL DEFAULT now(),
//         deleted_at timestamp with time zone,
//         UNIQUE (name),
//         PRIMARY KEY (id)
//     )`;

//   await sql`CREATE TABLE project (
//       id serial NOT NULL,
//       name varchar(255) NOT NULL,
//       is_enabled boolean NOT NULL DEFAULT true,
//       created_at timestamp with time zone NOT NULL DEFAULT now(),
//       updated_at timestamp with time zone NOT NULL DEFAULT now(),
//       deleted_at timestamp with time zone,
//       UNIQUE (name),
//       PRIMARY KEY (id)
//   )`;

//   await sql`CREATE TABLE contact (
//     id serial NOT NULL,
//     name varchar(255) NOT NULL,
//     email_address varchar(255) NOT NULL,
//     is_enabled boolean NOT NULL DEFAULT true,
//     created_at timestamp with time zone NOT NULL DEFAULT now(),
//     updated_at timestamp with time zone NOT NULL DEFAULT now(),
//     deleted_at timestamp with time zone,
//     UNIQUE (email_address),
//     PRIMARY KEY (id)
//   )`;
// });

// const group = await insertGroup("Administrators", true);
// const user = await insertUser(
//   "Sam Tucker",
//   "sam.tucker.uk@example.com",
//   "password",
//   true,
// );

// console.log("User: ", user);

// for 100 thousand times, add 100 groups
for (let i = 0; i < 100000; i++) {
  await insertGroup(`Group1 ${i}`, true, 1);
}

// const jwtSecret = await generateSecret();

// const envContent =
//   `DATABASE_URL=${postgresConnectionString}\nJWT_SECRET=${jwtSecret}\n`;
// await Deno.writeTextFile(".env", envContent);

// // console.log("Group: ", group);
// console.log("User: ", user);
// console.log(".env file has been created with DATABASE_URL and JWT_SECRET");

Deno.exit(0);
