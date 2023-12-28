import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { Project, ProjectService } from "../_services/project/project.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewProjectDialogComponent } from "../create-new-project-dialog/create-new-project-dialog.component";
import { defaultMatDialogTop } from "../util";
import { Router } from "@angular/router";

@Component({
  selector: "app-projects",
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
  templateUrl: "./projects.component.html",
  styleUrl: "./projects.component.scss",
})
export class ProjectsComponent {
  router = inject(Router);
  projectService = inject(ProjectService);
  dialog = inject(MatDialog);
  dataSource = new MatTableDataSource<Project>();
  displayedColumns: string[] = [
    "name",
    "clientName",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  exportProjects() {
    throw new Error("Method not implemented.");
  }

  onRowClick(project: Project) {
    this.router.navigate(["/projects", project.id]);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getAllProjects() {
    this.dataSource.data = await firstValueFrom(
      this.projectService.getAllProjects(),
    );
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    await this.getAllProjects();
  }

  async openCreateNewProjectDialog() {
    const dialogRef = this.dialog.open(CreateNewProjectDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Project;
    if (result) {
      await this.getAllProjects();
    }
  }
}
