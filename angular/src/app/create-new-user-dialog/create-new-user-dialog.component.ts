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
import { UserService } from "../_services/user/user.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-create-new-user-dialog",
  standalone: true,
  templateUrl: "./create-new-user-dialog.component.html",
  styleUrl: "./create-new-user-dialog.component.scss",
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
})
export class CreateNewUserDialogComponent {
  userService = inject(UserService);
  dialogRef: MatDialogRef<CreateNewUserDialogComponent> = inject(MatDialogRef);
  snackBar: MatSnackBar = inject(MatSnackBar);
  createNewUserForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    isEnabled: new FormControl(true),
    emailAddress: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required]),
  });

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.userService.createNewUser({
        name: this.createNewUserForm.value.name!,
        isEnabled: this.createNewUserForm.value.isEnabled!,
        emailAddress: this.createNewUserForm.value.emailAddress!,
        password: this.createNewUserForm.value.password!,
      }));
      this.snackBar.open("User created", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error creating user", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
