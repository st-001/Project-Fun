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
      password: string;
      isEnabled: boolean;
    },
  ): Observable<User> {
    return this.http.post<User>(`/api/users`, user);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`/api/users`);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`/api/users/${id}`);
  }

  updateUserById(
    id: number,
    user: {
      name: string;
      emailAddress: string;
      isEnabled: boolean;
    },
  ): Observable<User> {
    return this.http.put<User>(`/api/users/${id}`, user);
  }

  resetUserPassword(id: number, newPassword: string): Observable<void> {
    return this.http.put<void>(`/api/users/${id}/password`, { newPassword });
  }
}
