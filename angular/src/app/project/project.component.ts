import { Component, inject } from "@angular/core";
import { Project, ProjectService } from "../_services/project/project.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-project",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
  ],
  templateUrl: "./project.component.html",
  styleUrl: "./project.component.scss",
})
export class ProjectComponent {
  refreshNotes() {
    throw new Error("Method not implemented.");
  }
  refreshProject() {
    throw new Error("Method not implemented.");
  }
  openEditProjectDialog() {
    throw new Error("Method not implemented.");
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  projectService = inject(ProjectService);
  project: Project | undefined;
  constructor() {}

  async ngOnInit() {
    const projectId = Number(this.route.snapshot.paramMap.get("id"));
    try {
      this.project = await firstValueFrom(
        this.projectService.getProjectById(projectId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/projects"]);
      }
    }
  }
}
