import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Project {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class ProjectService {
  constructor(private http: HttpClient) {}

  createNewProject(
    project: { name: string; isEnabled: boolean },
  ): Observable<Project> {
    return this.http.post<Project>(`/api/projects`, project);
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<Project[]>(`/api/projects`);
  }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`/api/projects/${id}`);
  }
}
