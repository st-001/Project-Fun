import { Component, inject } from "@angular/core";
import { Contact, ContactService } from "../_services/contact/contact.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
  ],
  templateUrl: "./contact.component.html",
  styleUrl: "./contact.component.scss",
})
export class ContactComponent {
  refreshNotes() {
    throw new Error("Method not implemented.");
  }
  refreshContact() {
    throw new Error("Method not implemented.");
  }
  openEditContactDialog() {
    throw new Error("Method not implemented.");
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  contactService = inject(ContactService);
  contact: Contact | undefined;
  constructor() {}

  async ngOnInit() {
    const contactId = Number(this.route.snapshot.paramMap.get("id"));
    try {
      this.contact = await firstValueFrom(
        this.contactService.getContactById(contactId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/contacts"]);
      }
    }
  }
}
