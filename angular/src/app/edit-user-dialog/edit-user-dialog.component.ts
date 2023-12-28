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
import { User, UserService } from "../_services/user/user.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-edit-user-dialog",
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
  templateUrl: "./edit-user-dialog.component.html",
  styleUrl: "./edit-user-dialog.component.scss",
})
export class EditUserDialogComponent {
  userService: UserService = inject(UserService);
  dialogRef: MatDialogRef<EditUserDialogComponent> = inject(MatDialogRef);
  snackBar: MatSnackBar = inject(MatSnackBar);
  dialogInputData: { userId: number } = inject(MAT_DIALOG_DATA);
  user: User | undefined;
  editUserForm: FormGroup | undefined;

  async ngOnInit() {
    this.user = await firstValueFrom(
      this.userService.getUserById(this.dialogInputData.userId),
    );
    this.editUserForm = new FormGroup({
      name: new FormControl(this.user.name, [Validators.required]),
      emailAddress: new FormControl(this.user.emailAddress, [
        Validators.required,
        Validators.email,
      ]),
      isEnabled: new FormControl(this.user.isEnabled),
    });
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(
        this.userService.updateUserById(this.user!.id, {
          name: this.editUserForm!.value.name,
          isEnabled: this.editUserForm!.value.isEnabled,
          emailAddress: this.editUserForm!.value.emailAddress,
        }),
      );
      this.snackBar.open("User updated.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error updating user.", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
