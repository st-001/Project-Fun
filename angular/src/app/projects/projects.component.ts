import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class ProjectsComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  async refreshProjects() {
    const projects = await this.getAllProjects();
    this.dataSource.data = projects;
  }
  exportProjects() {
    throw new Error("Method not implemented.");
  }

  private projectService = inject(ProjectService);
  dataSource = new MatTableDataSource<Project>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  constructor(public dialog: MatDialog) {}

  async getAllProjects() {
    const projects = await firstValueFrom(this.projectService.getAll());
    return projects;
  }

  private setupTableFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    const projects = await this.getAllProjects();
    this.dataSource.data = projects;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.setupTableFeatures();
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
      await this.refreshProjects();
    }
  }
}
