import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./auth.service";

export function authInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
) {
  const accessToken = inject(AuthService).getAccessToken();
  const newReq = req.clone({
    headers: req.headers.set("Authorization", `Bearer ${accessToken}`),
  });
  return next(newReq);
}
