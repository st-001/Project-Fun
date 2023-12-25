import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface User {
  id: number;
  name: string;
  emailAddress: string;
  primaryGroupId: number;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  createNewUser(
    user: {
      name: string;
      emailAddress: string;
      primaryGroupId: number;
      password: string;
      isEnabled: boolean;
    },
  ): Observable<User> {
    return this.http.post<User>(`/api/users`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`/api/users`);
  }
}
