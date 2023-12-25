import { inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";

export interface LoginBody {
  emailAddress: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private authUrl = "/api/authenticate";
  private router = inject(Router);

  async login(loginBody: LoginBody) {
    const response = await fetch(this.authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginBody),
    });

    if (!response.ok) {
      return false;
    }

    const accessToken = (await response.json()).accessToken;
    localStorage.setItem("accessToken", accessToken);

    this.router.navigate([""]);

    return true;
  }

  logout() {
    localStorage.removeItem("accessToken");
    this.router.navigate(["/login"]);
  }

  async verifyAccessToken() {
    if (!localStorage.getItem("accessToken")) {
      this.router.navigate(["/login"]);
      return false;
    }
    const response = await fetch("/api/verify-access-token", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  }

  getAccessToken() {
    return localStorage.getItem("accessToken");
  }
}
