import { Component, ElementRef, inject, Input, ViewChild } from "@angular/core";
import { Task, TaskService } from "../_services/task/task.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewTaskDialogComponent } from "../create-new-task-dialog/create-new-task-dialog.component";
import { defaultMatDialogTop } from "../util";
import { Router } from "@angular/router";

@Component({
  selector: "app-tasks",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: "./tasks.component.html",
  styleUrl: "./tasks.component.scss",
})
export class TasksComponent {
  router = inject(Router);
  dialog = inject(MatDialog);
  taskService = inject(TaskService);
  dataSource = new MatTableDataSource<Task>();
  displayedColumns: string[] = [
    "name",
    "client",
    "project",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];

  @Input()
  queryParams: { isEnabled?: boolean; projectId?: number } = {};

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  exportTasks() {
    throw new Error("Method not implemented.");
  }

  onRowClick(task: Task) {
    this.router.navigate(["/tasks", task.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getAllTasks() {
    this.dataSource.data = await firstValueFrom(
      this.taskService.getAll(this.queryParams),
    );
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    await this.getAllTasks();
  }

  async openCreateNewTaskDialog() {
    const dialogRef = this.dialog.open(CreateNewTaskDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        projectId: this.queryParams.projectId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Task;
    if (result) {
      await this.getAllTasks();
    }
  }
}
