import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class TasksComponent implements OnInit {
  router = inject(Router);
  onRowClick(task: Task) {
    this.router.navigate(["/tasks", task.id]);
  }
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  async refreshTasks() {
    const tasks = await this.getAllTasks();
    this.dataSource.data = tasks;
  }
  exportTasks() {
    throw new Error("Method not implemented.");
  }

  private taskService = inject(TaskService);
  dataSource = new MatTableDataSource<Task>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  constructor(public dialog: MatDialog) {}

  async getAllTasks() {
    const tasks = await firstValueFrom(this.taskService.getAll());
    return tasks;
  }

  private setupTableFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    const tasks = await this.getAllTasks();
    this.dataSource.data = tasks;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.setupTableFeatures();
  }

  async openCreateNewTaskDialog() {
    const dialogRef = this.dialog.open(CreateNewTaskDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Task;
    if (result) {
      await this.refreshTasks();
    }
  }
}
