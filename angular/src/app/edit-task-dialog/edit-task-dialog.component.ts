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
import { Task, TaskService } from "../_services/task/task.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-edit-task-dialog",
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
  templateUrl: "./edit-task-dialog.component.html",
  styleUrl: "./edit-task-dialog.component.scss",
})
export class EditTaskDialogComponent {
  taskService: TaskService = inject(TaskService);
  dialogRef: MatDialogRef<EditTaskDialogComponent> = inject(MatDialogRef);
  snackBar: MatSnackBar = inject(MatSnackBar);
  dialogInputData: { taskId: number } = inject(MAT_DIALOG_DATA);
  task: Task | undefined;
  editTaskForm: FormGroup | undefined;

  async ngOnInit() {
    this.task = await firstValueFrom(
      this.taskService.getTaskById(this.dialogInputData.taskId),
    );
    this.editTaskForm = new FormGroup({
      name: new FormControl(this.task.name, [Validators.required]),
      isEnabled: new FormControl(this.task.isEnabled),
    });
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(
        this.taskService.updateTaskById(this.task!.id, {
          name: this.editTaskForm!.value.name!,
          isEnabled: this.editTaskForm!.value.isEnabled!,
        }),
      );
      this.snackBar.open("Task updated.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error updating task.", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
