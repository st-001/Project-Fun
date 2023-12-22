import postgres from "https://deno.land/x/postgresjs@v3.4.3/mod.js";

const connectionString = Deno.env.get("DATABASE_URL") || "";

const sql = postgres(connectionString);

export default sql;
