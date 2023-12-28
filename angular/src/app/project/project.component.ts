import { Component, inject } from "@angular/core";
import { Project, ProjectService } from "../_services/project/project.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { EditProjectDialogComponent } from "../edit-project-dialog/edit-project-dialog.component";
import { defaultMatDialogTop } from "../util";
import { NotesComponent } from "../notes/notes.component";

@Component({
  selector: "app-project",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
    NotesComponent,
  ],
  templateUrl: "./project.component.html",
  styleUrl: "./project.component.scss",
})
export class ProjectComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  projectService = inject(ProjectService);
  project: Project | undefined;
  projectId: number;
  constructor() {
    this.projectId = Number(this.route.snapshot.paramMap.get("id"));
  }

  async ngOnInit() {
    await this.getProject();
  }

  refreshNotes() {
    throw new Error("Method not implemented.");
  }

  async getProject() {
    try {
      this.project = await firstValueFrom(
        this.projectService.getProjectById(this.projectId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/projects"]);
      }
    }
  }

  async openEditProjectDialog() {
    const dialogRef = this.dialog.open(EditProjectDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        projectId: this.projectId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Project;
    if (result) {
      await this.getProject();
    }
  }
}
