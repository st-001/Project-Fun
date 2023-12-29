import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { Contact, ContactService } from "../_services/contact/contact.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewContactDialogComponent } from "../create-new-contact-dialog/create-new-contact-dialog.component";
import { defaultMatDialogTop } from "../util";
import { Router } from "@angular/router";

@Component({
  selector: "app-contacts",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: "./contacts.component.html",
  styleUrl: "./contacts.component.scss",
})
export class ContactsComponent {
  router = inject(Router);
  dialog = inject(MatDialog);
  contactService = inject(ContactService);
  dataSource = new MatTableDataSource<Contact>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "clientName",
    "jobTitle",
    "emailAddress",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  onRowClick(contact: Contact) {
    this.router.navigate(["/contacts", contact.id]);
  }

  exportContacts() {
    throw new Error("Method not implemented.");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  async getAllContacts() {
    this.dataSource.data = await firstValueFrom(this.contactService.getAll());
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    await this.getAllContacts();
  }

  async openCreateNewContactDialog() {
    const dialogRef = this.dialog.open(CreateNewContactDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Contact;
    if (result) {
      await this.getAllContacts();
    }
  }
}
