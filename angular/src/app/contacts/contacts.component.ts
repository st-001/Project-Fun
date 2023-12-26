import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class ContactsComponent implements OnInit {
  router = inject(Router);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  onRowClick(contact: Contact) {
    this.router.navigate(["/contacts", contact.id]);
  }

  async refreshContacts() {
    const contacts = await this.getAllContacts();
    this.dataSource.data = contacts;
  }
  exportContacts() {
    throw new Error("Method not implemented.");
  }

  private contactService = inject(ContactService);
  dataSource = new MatTableDataSource<Contact>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "clientName",
    "emailAddress",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  constructor(public dialog: MatDialog) {}

  async getAllContacts() {
    const contacts = await firstValueFrom(this.contactService.getAll());
    return contacts;
  }

  private setupTableFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    const contacts = await this.getAllContacts();
    this.dataSource.data = contacts;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.setupTableFeatures();
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
      await this.refreshContacts();
    }
  }
}
