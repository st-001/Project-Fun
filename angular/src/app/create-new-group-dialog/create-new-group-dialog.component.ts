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
import { GroupService } from "../_services/group/group.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-create-new-group-dialog",
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
  templateUrl: "./create-new-group-dialog.component.html",
  styleUrl: "./create-new-group-dialog.component.scss",
})
export class CreateNewGroupDialogComponent {
  groupService: GroupService = inject(GroupService);
  createNewGroupForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    isEnabled: new FormControl(true),
  });
  constructor(
    public dialogRef: MatDialogRef<CreateNewGroupDialogComponent>,
    private _snackBar: MatSnackBar,
  ) {}

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.groupService.createNewGroup({
        name: this.createNewGroupForm.value.name!,
        isEnabled: this.createNewGroupForm.value.isEnabled!,
      }));
      this.dialogRef.close(result);
    } catch (error) {
      this._snackBar.open("Error creating group", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
      this.dialogRef.close();
      return;
    }

    this._snackBar.open("Group created", "Dismiss", {
      duration: 5000,
    });
  }
}
