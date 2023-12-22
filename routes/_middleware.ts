import { FreshContext } from "$fresh/server.ts";
import { jsonResponse } from "../utils.ts";
import { verifyJwt } from "../jwt.ts";
import { getUserById } from "../models/user.ts";

interface State {
  userId: number;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  if (ctx.route === "/authenticate") {
    return ctx.next();
  }

  if (ctx.route.includes("/:id")) {
    const id = Number(ctx.params.id);
    if (Number.isNaN(id)) {
      return jsonResponse({ error: "Not Found" }, 404);
    }
  }
  try {
    const token = await verifyJwt(
      req.headers.get("authorization")!.split(" ")[1],
      Deno.env.get("JWT_SECRET")!,
    );
    ctx.state.userId = token.id as number;
    const user = await getUserById(ctx.state.userId);
    if (!user.isEnabled) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
  } catch (_error) {
    console.log(_error);
    return jsonResponse({ error: "Unauthorized" }, 401);
  }

  const resp = await ctx.next();
  return resp;
}
