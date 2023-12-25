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
import { GroupSelectSearchComponent } from "../_fields/group-select-search/group-select-search.component";

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
    GroupSelectSearchComponent,
  ],
})
export class CreateNewUserDialogComponent {
  userService = inject(UserService);
  createNewUserForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    isEnabled: new FormControl(true),
    emailAddress: new FormControl("", [Validators.required]),
    primaryGroupId: new FormControl(null, [Validators.required]),
    password: new FormControl("", [Validators.required]),
  });
  constructor(
    public dialogRef: MatDialogRef<CreateNewUserDialogComponent>,
    private _snackBar: MatSnackBar,
  ) {}

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.userService.createNewUser({
        name: this.createNewUserForm.value.name!,
        isEnabled: this.createNewUserForm.value.isEnabled!,
        emailAddress: this.createNewUserForm.value.emailAddress!,
        primaryGroupId: this.createNewUserForm.value.primaryGroupId!,
        password: this.createNewUserForm.value.password!,
      }));
      this.dialogRef.close(result);
    } catch (error) {
      this._snackBar.open("Error creating user", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
      this.dialogRef.close();
      return;
    }

    this._snackBar.open("User created", "Dismiss", {
      duration: 5000,
    });
  }
}
