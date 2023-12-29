import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Project } from "../project/project.service";

export interface Task {
  id: number;
  name: string;
  isEnabled: boolean;
  project: Project;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class TaskService {
  http = inject(HttpClient);

  createNewTask(
    task: { name: string; isEnabled: boolean; projectId: number },
  ): Observable<Task> {
    return this.http.post<Task>(`/api/tasks`, task);
  }

  getAll(
    queryParams: { isEnabled?: boolean; projectId?: number } = {},
  ): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/tasks`, { params: queryParams });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`/api/tasks/${id}`);
  }

  updateTaskById(
    id: number,
    task: { name: string; isEnabled: boolean; projectId: number },
  ): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${id}`, task);
  }
}
