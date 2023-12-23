// deno-lint-ignore no-explicit-any
export function httpJsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function httpResponse204NoContent() {
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

export function httpResponse401Unauthorized() {
  return new Response(null, { status: 401 });
}

export function httpResponse201Created() {
  return new Response(null, { status: 201 });
}
