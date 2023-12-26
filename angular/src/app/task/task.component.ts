import { Component, inject } from "@angular/core";
import { Task, TaskService } from "../_services/task/task.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-task",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
  ],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  refreshNotes() {
    throw new Error("Method not implemented.");
  }
  refreshTask() {
    throw new Error("Method not implemented.");
  }
  openEditTaskDialog() {
    throw new Error("Method not implemented.");
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  taskService = inject(TaskService);
  task: Task | undefined;
  constructor() {}

  async ngOnInit() {
    const taskId = Number(this.route.snapshot.paramMap.get("id"));
    try {
      this.task = await firstValueFrom(
        this.taskService.getTaskById(taskId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/tasks"]);
      }
    }
  }
}
