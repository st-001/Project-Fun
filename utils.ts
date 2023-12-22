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

export function httpResponse204Created() {
  return new Response(null, { status: 204 });
}

// deno-lint-ignore no-explicit-any
export function httpResponse500InternalServerError(error: any) {
  console.error(error);
  return new Response(error, {
    status: 500,
    headers: { "Content-Type": "text/plain" },
  });
}

export function httpResponse404NotFound() {
  return new Response(null, { status: 404 });
}
