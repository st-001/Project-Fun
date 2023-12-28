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
import { Contact, ContactService } from "../_services/contact/contact.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientSelectSearchComponent } from "../_fields/client-select-search/client-select-search.component";

@Component({
  selector: "app-edit-contact-dialog",
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
    ClientSelectSearchComponent,
  ],
  templateUrl: "./edit-contact-dialog.component.html",
  styleUrl: "./edit-contact-dialog.component.scss",
})
export class EditContactDialogComponent {
  contactService: ContactService = inject(ContactService);
  contact: Contact | undefined;
  editContactForm: FormGroup | undefined;
  constructor(
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogInputData: { contactId: number },
    private _snackBar: MatSnackBar,
  ) {}

  async ngOnInit() {
    this.contact = await firstValueFrom(
      this.contactService.getContactById(this.dialogInputData.contactId),
    );
    this.editContactForm = new FormGroup({
      name: new FormControl(this.contact.name, [Validators.required]),
      emailAddress: new FormControl(this.contact.emailAddress, [
        Validators.required,
        Validators.email,
      ]),
      clientId: new FormControl(this.contact.client.id, [Validators.required]),
      isEnabled: new FormControl(this.contact.isEnabled),
    });
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(
        this.contactService.updateContactById(this.contact!.id, {
          name: this.editContactForm!.value.name!,
          isEnabled: this.editContactForm!.value.isEnabled!,
          emailAddress: this.editContactForm!.value.emailAddress!,
          clientId: this.editContactForm!.value.clientId!,
        }),
      );
      this._snackBar.open("Contact updated.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this._snackBar.open("Error updating contact.", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
