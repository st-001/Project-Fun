import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "../client/client.service";

export interface Project {
  id: number;
  name: string;
  isEnabled: boolean;
  client: Client;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class ProjectService {
  http = inject(HttpClient);

  createNewProject(
    project: { name: string; isEnabled: boolean; clientId: number },
  ): Observable<Project> {
    return this.http.post<Project>(`/api/projects`, project);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`/api/projects`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`/api/projects/${id}`);
  }

  updateProjectById(
    id: number,
    project: { name: string; isEnabled: boolean; clientId: number },
  ): Observable<Project> {
    return this.http.put<Project>(`/api/projects/${id}`, project);
  }
}
