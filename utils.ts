// deno-lint-ignore no-explicit-any
export function jsonResponse(data: any, status = 200) {
  if (status === 204 && data === null) {
    return new Response(null, { status });
  }
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
