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
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { UserService } from "../_services/user/user.service";

@Component({
  selector: "app-reset-user-password-dialog",
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
  templateUrl: "./reset-user-password-dialog.component.html",
  styleUrl: "./reset-user-password-dialog.component.scss",
})
export class ResetUserPasswordDialogComponent {
  userService = inject(UserService);
  resetUserPasswordForm = new FormGroup({
    newPassword: new FormControl("", [
      Validators.required,
      Validators.minLength(6),
    ]),
  });
  constructor(
    public dialogRef: MatDialogRef<ResetUserPasswordDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInputData: { userId: number },
    private _snackBar: MatSnackBar,
  ) {}

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.userService.resetUserPassword(
        this.dialogInputData.userId,
        this.resetUserPasswordForm.value.newPassword!,
      ));
      this._snackBar.open("User password reset.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this._snackBar.open("Failed to reset user password.", "Dismiss", {
        duration: 5000,
      });
    } finally {
      this.dialogRef.close(result);
    }
  }
}
