import { Component, inject } from "@angular/core";
import { NoteService } from "../_services/note/note.service";
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
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-create-new-note-dialog",
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
  ],
  templateUrl: "./create-new-note-dialog.component.html",
  styleUrl: "./create-new-note-dialog.component.scss",
})
export class CreateNewNoteDialogComponent {
  noteService = inject(NoteService);
  dialogRef = inject(MatDialogRef<CreateNewNoteDialogComponent>);
  snackBar = inject(MatSnackBar);
  dialogInputData: {
    entityType: string;
    entityId: number;
  } = inject(MAT_DIALOG_DATA);
  createNewNoteForm = new FormGroup({
    content: new FormControl("", [Validators.required]),
  });

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.noteService.createNewNote({
        content: this.createNewNoteForm.value.content!,
        entityType: this.dialogInputData.entityType,
        entityId: this.dialogInputData.entityId,
      }));
      this.snackBar.open("Note created", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error creating note", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
