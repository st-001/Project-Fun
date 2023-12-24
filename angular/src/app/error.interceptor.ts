import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { catchError, throwError } from "rxjs";
import { AuthService } from "./auth.service";

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(catchError((error) => {
    console.log(error);
    if (error.status === 401) {
      console.log("Hitting Interceptor");
      authService.logout();
    }
    return throwError(() => error);
  }));
};
