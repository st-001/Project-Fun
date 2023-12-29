import { Component, inject } from "@angular/core";
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
import { TaskService } from "../_services/task/task.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ProjectSelectSearchComponent } from "../_fields/project-select-search/project-select-search.component";

@Component({
  selector: "app-create-new-task-dialog",
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
    ProjectSelectSearchComponent,
  ],
  templateUrl: "./create-new-task-dialog.component.html",
  styleUrl: "./create-new-task-dialog.component.scss",
})
export class CreateNewTaskDialogComponent {
  taskService: TaskService = inject(TaskService);
  dialogRef: MatDialogRef<CreateNewTaskDialogComponent> = inject(
    MatDialogRef,
  );
  dialogInputData: { projectId: number | undefined } = inject(MAT_DIALOG_DATA);

  snackBar: MatSnackBar = inject(MatSnackBar);
  createNewTaskForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    projectId: new FormControl(this.dialogInputData.projectId, [
      Validators.required,
    ]),
    isEnabled: new FormControl(true),
  });

  async ngOnInit() {
    if (this.dialogInputData.projectId) {
      this.createNewTaskForm.controls.projectId.disable();
    }
  }

  async submitForm() {
    let result;
    try {
      console.log(this.createNewTaskForm.controls.projectId.value);
      result = await firstValueFrom(this.taskService.createNewTask({
        name: this.createNewTaskForm.value.name!,
        projectId: this.createNewTaskForm.controls.projectId.value!,
        isEnabled: this.createNewTaskForm.value.isEnabled!,
      }));
      this.snackBar.open("Task created", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error creating task", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
