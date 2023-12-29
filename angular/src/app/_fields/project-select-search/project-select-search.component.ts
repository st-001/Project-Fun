import { Component, inject, Input, ViewChild } from "@angular/core";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AsyncPipe } from "@angular/common";
import { FormControl } from "@angular/forms";
import { firstValueFrom, ReplaySubject, Subject, takeUntil } from "rxjs";
import {
  Project,
  ProjectService,
} from "../../_services/project/project.service";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-project-select-search",
  standalone: true,
  imports: [
    MatSelectModule,
    NgxMatSelectSearchModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: "./project-select-search.component.html",
  styleUrl: "./project-select-search.component.scss",
})
export class ProjectSelectSearchComponent {
  @Input()
  public placeholder!: string;
  @Input()
  public control!: FormControl;

  projectService = inject(ProjectService);
  projects: Project[] = [];
  projectFilterCtrl: FormControl = new FormControl("");
  filteredProjects: ReplaySubject<Project[]> = new ReplaySubject<Project[]>(1);
  @ViewChild("projectSelect", { static: true })
  projectSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  async ngOnInit() {
    this.projects = await firstValueFrom(this.projectService.getAllProjects());

    this.filteredProjects.next(this.projects.slice());

    this.projectFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterProjects();
      });
  }

  protected filterProjects() {
    if (!this.projects) {
      return;
    }

    let search = this.projectFilterCtrl.value;
    if (!search) {
      this.filteredProjects.next(this.projects.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredProjects.next(
      this.projects.filter((project) =>
        project.name.toLowerCase().indexOf(search) > -1
      ),
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
