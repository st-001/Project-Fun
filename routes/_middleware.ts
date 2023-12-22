import { FreshContext } from "$fresh/server.ts";
import {
  httpResponse401Unauthorized,
  httpResponse404NotFound,
} from "../utils.ts";
import { verifyJwt } from "../jwt.ts";
import { getUserById } from "../models/user.ts";

interface State {
  userId: number;
  requestId: string;
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
      return httpResponse404NotFound();
    }
  }
  try {
    const token = await verifyJwt(
      req.headers.get("authorization")!.split(" ")[1],
      Deno.env.get("JWT_SECRET")!,
    );
    ctx.state.userId = token.id as number;
    const user = await getUserById(ctx.state.userId);
    if (!user!.isEnabled) {
      return httpResponse401Unauthorized();
    }
  } catch (_error) {
    console.log(_error);
    return httpResponse401Unauthorized();
  }

  const resp = await ctx.next();
  return resp;
}
