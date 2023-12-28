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
import { Group, GroupService } from "../_services/group/group.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-edit-group-dialog",
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
  templateUrl: "./edit-group-dialog.component.html",
  styleUrl: "./edit-group-dialog.component.scss",
})
export class EditGroupDialogComponent {
  groupService: GroupService = inject(GroupService);
  group: Group | undefined;
  editGroupForm: FormGroup | undefined;
  constructor(
    public dialogRef: MatDialogRef<EditGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInputData: { groupId: number },
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.group = await firstValueFrom(
      this.groupService.getGroupById(this.dialogInputData.groupId),
    );
    this.editGroupForm = new FormGroup({
      name: new FormControl(this.group.name, [Validators.required]),
      isEnabled: new FormControl(this.group.isEnabled),
    });
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(
        this.groupService.updateGroupById(this.group!.id, {
          name: this.editGroupForm!.value.name!,
          isEnabled: this.editGroupForm!.value.isEnabled!,
        }),
      );
      this._snackBar.open("Group updated.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this._snackBar.open("Error updating group.", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
