import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Group {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class GroupService {
  constructor(private http: HttpClient) {}

  createNewGroup(
    group: { name: string; isEnabled: boolean },
  ): Observable<Group> {
    return this.http.post<Group>(`/api/groups`, group);
  }

  getAll(): Observable<Group[]> {
    return this.http.get<Group[]>(`/api/groups`);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`/api/groups/${id}`);
  }
}
