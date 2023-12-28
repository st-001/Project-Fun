import { Component, Inject, inject } from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { Project, ProjectService } from "../_services/project/project.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientSelectSearchComponent } from "../_fields/client-select-search/client-select-search.component";

@Component({
  selector: "app-edit-project-dialog",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogTitle,
    MatDialogContent,
    MatCheckboxModule,
    ClientSelectSearchComponent,
  ],
  templateUrl: "./edit-project-dialog.component.html",
  styleUrl: "./edit-project-dialog.component.scss",
})
export class EditProjectDialogComponent {
  projectService: ProjectService = inject(ProjectService);
  project: Project | undefined;
  editProjectForm: FormGroup | undefined;
  constructor(
    public dialogRef: MatDialogRef<EditProjectDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInputData: { projectId: number },
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.project = await firstValueFrom(
      this.projectService.getProjectById(this.dialogInputData.projectId),
    );
    this.editProjectForm = new FormGroup({
      name: new FormControl(this.project.name, [Validators.required]),
      isEnabled: new FormControl(this.project.isEnabled, [Validators.required]),
      clientId: new FormControl(this.project.client.id, [Validators.required]),
    });
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(
        this.projectService.updateProjectById(this.project!.id, {
          name: this.editProjectForm!.value.name!,
          isEnabled: this.editProjectForm!.value.isEnabled!,
          clientId: this.editProjectForm!.value.clientId!,
        }),
      );
      this._snackBar.open("Project updated.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this._snackBar.open("Error updating project.", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
