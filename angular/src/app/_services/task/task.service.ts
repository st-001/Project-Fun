import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Task {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class TaskService {
  http = inject(HttpClient);

  createNewTask(
    task: { name: string; isEnabled: boolean },
  ): Observable<Task> {
    return this.http.post<Task>(`/api/tasks`, task);
  }

  getAll(): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/tasks`);
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`/api/tasks/${id}`);
  }

  updateTaskById(
    id: number,
    task: { name: string; isEnabled: boolean },
  ): Observable<Task> {
    return this.http.put<Task>(`/api/tasks/${id}`, task);
  }
}
