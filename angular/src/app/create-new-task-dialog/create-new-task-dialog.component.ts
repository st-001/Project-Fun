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
import { TaskService } from "../_services/task/task.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

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
  ],
  templateUrl: "./create-new-task-dialog.component.html",
  styleUrl: "./create-new-task-dialog.component.scss",
})
export class CreateNewTaskDialogComponent {
  taskService: TaskService = inject(TaskService);
  createNewTaskForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    isEnabled: new FormControl(true),
  });
  constructor(
    public dialogRef: MatDialogRef<CreateNewTaskDialogComponent>,
    private _snackBar: MatSnackBar,
  ) {}

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.taskService.createNewTask({
        name: this.createNewTaskForm.value.name!,
        isEnabled: this.createNewTaskForm.value.isEnabled!,
      }));
      this._snackBar.open("Task created", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this._snackBar.open("Error creating task", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
