import { Component, inject } from "@angular/core";
import { Contact, ContactService } from "../_services/contact/contact.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { EditContactDialogComponent } from "../edit-contact-dialog/edit-contact-dialog.component";
import { defaultMatDialogTop } from "../util";
import { NotesComponent } from "../notes/notes.component";
import { AssistantComponent } from "../assistant/assistant.component";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
    NotesComponent,
    AssistantComponent,
  ],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  contactService = inject(ContactService);
  contact: Contact | undefined;
  contactId = Number(this.route.snapshot.paramMap.get("id"));

  async ngOnInit() {
    await this.getContact();
  }

  async getContact() {
    try {
      this.contact = await firstValueFrom(
        this.contactService.getContactById(this.contactId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/contacts"]);
      }
    }
  }

  refreshNotes() {
    throw new Error("Method not implemented.");
  }

  async openEditContactDialog() {
    const dialogRef = this.dialog.open(EditContactDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        contactId: this.contactId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Contact;
    if (result) {
      await this.getContact();
    }
  }
}
