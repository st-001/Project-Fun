import { Component, inject } from "@angular/core";
import {
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
import { ProjectService } from "../_services/project/project.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientSelectSearchComponent } from "../_fields/client-select-search/client-select-search.component";

@Component({
  selector: "app-create-new-project-dialog",
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
  templateUrl: "./create-new-project-dialog.component.html",
  styleUrl: "./create-new-project-dialog.component.scss",
})
export class CreateNewProjectDialogComponent {
  projectService: ProjectService = inject(ProjectService);
  createNewProjectForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    clientId: new FormControl(null, [Validators.required]),
    isEnabled: new FormControl(true),
  });
  constructor(
    public dialogRef: MatDialogRef<CreateNewProjectDialogComponent>,
    private _snackBar: MatSnackBar,
  ) {}

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.projectService.createNewProject({
        name: this.createNewProjectForm.value.name!,
        clientId: this.createNewProjectForm.value.clientId!,
        isEnabled: this.createNewProjectForm.value.isEnabled!,
      }));
      this._snackBar.open("Project created", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this._snackBar.open("Error creating project", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
