import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

export interface LoginBody {
  email: string;
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
  private loggedInSubject = new BehaviorSubject<boolean>(
    this.checkInitialLoginStatus(),
  );
  public loggedIn$ = this.loggedInSubject.asObservable();

  private checkInitialLoginStatus(): boolean {
    return !!localStorage.getItem("accessToken");
  }

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
    this.loggedInSubject.next(true);

    return true;
  }

  async logout() {
    localStorage.removeItem("accessToken");
    this.loggedInSubject.next(false);
  }
}