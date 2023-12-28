import { Component, inject, Input } from "@angular/core";
import { Note, NoteService } from "../_services/note/note.service";
import { MatCardModule } from "@angular/material/card";
import { firstValueFrom } from "rxjs";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatDividerModule } from "@angular/material/divider";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewNoteDialogComponent } from "../create-new-note-dialog/create-new-note-dialog.component";
import { defaultMatDialogTop } from "../util";

@Component({
  selector: "app-notes",
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    DatePipe,
    MatDividerModule,
  ],
  templateUrl: "./notes.component.html",
  styleUrl: "./notes.component.scss",
})
export class NotesComponent {
  dialog = inject(MatDialog);
  noteService = inject(NoteService);
  notes: Note[] = [];

  @Input()
  entityType!: string;

  @Input()
  entityId!: number;

  async getNotesByEntityAndId() {
    this.notes = await firstValueFrom(this.noteService.getNotesByEntityAndId(
      this.entityType,
      this.entityId,
    ));
  }

  async ngOnInit() {
    await this.getNotesByEntityAndId();
  }

  async openCreateNoteDialog() {
    const dialogRef = this.dialog.open(CreateNewNoteDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        entityType: this.entityType,
        entityId: this.entityId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Note;
    if (result) {
      await this.getNotesByEntityAndId();
    }
  }
}
