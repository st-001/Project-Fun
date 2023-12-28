import { Component, inject } from "@angular/core";
import { Task, TaskService } from "../_services/task/task.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { EditTaskDialogComponent } from "../edit-task-dialog/edit-task-dialog.component";
import { defaultMatDialogTop } from "../util";
import { NotesComponent } from "../notes/notes.component";

@Component({
  selector: "app-task",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
    NotesComponent,
  ],
  templateUrl: "./task.component.html",
  styleUrl: "./task.component.scss",
})
export class TaskComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  taskService = inject(TaskService);
  task: Task | undefined;
  taskId: number;
  constructor() {
    this.taskId = Number(this.route.snapshot.paramMap.get("id"));
  }

  async ngOnInit() {
    await this.getTask();
  }

  async getTask() {
    try {
      this.task = await firstValueFrom(
        this.taskService.getTaskById(this.taskId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/tasks"]);
      }
    }
  }

  refreshNotes() {
    throw new Error("Method not implemented.");
  }

  async openEditTaskDialog() {
    const dialogRef = this.dialog.open(EditTaskDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        taskId: this.taskId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Task;
    if (result) {
      await this.getTask();
    }
  }
}
