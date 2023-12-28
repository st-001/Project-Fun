import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { User } from "../user/user.service";
import { Observable } from "rxjs";

export enum EntityType {
  User = "user",
  Group = "group",
  Project = "project",
  Task = "task",
  Client = "client",
  Contact = "contact",
}

export interface Note {
  id: number;
  entityType: EntityType;
  entityId: number;
  content: string;
  createdAt: Date;
  createdBy: User;
}

@Injectable({
  providedIn: "root",
})
export class NoteService {
  http = inject(HttpClient);

  getNotesByEntityAndId(
    entityType: string,
    entityId: number,
  ): Observable<Note[]> {
    return this.http.get<Note[]>(`/api/notes`, {
      params: { entityType, entityId },
    });
  }

  createNewNote(
    note: { entityType: string; entityId: number; content: string },
  ): Observable<Note> {
    return this.http.post<Note>(`/api/notes`, note);
  }
}
