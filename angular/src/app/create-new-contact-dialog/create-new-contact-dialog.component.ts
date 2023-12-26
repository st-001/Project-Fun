import { Component, inject } from "@angular/core";
import {
  MatDialog,
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
import { ContactService } from "../_services/contact/contact.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientSelectSearchComponent } from "../_fields/client-select-search/client-select-search.component";

@Component({
  selector: "app-create-new-contact-dialog",
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
  templateUrl: "./create-new-contact-dialog.component.html",
  styleUrl: "./create-new-contact-dialog.component.scss",
})
export class CreateNewContactDialogComponent {
  contactService: ContactService = inject(ContactService);
  createNewContactForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    emailAddress: new FormControl("", [Validators.required]),
    clientId: new FormControl(null, [Validators.required]),
    isEnabled: new FormControl(true),
  });
  constructor(
    public dialogRef: MatDialogRef<CreateNewContactDialogComponent>,
    private _snackBar: MatSnackBar,
  ) {}

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.contactService.createNewContact({
        name: this.createNewContactForm.value.name!,
        isEnabled: this.createNewContactForm.value.isEnabled!,
        emailAddress: this.createNewContactForm.value.emailAddress!,
        clientId: this.createNewContactForm.value.clientId!,
      }));
      this.dialogRef.close(result);
    } catch (error) {
      this._snackBar.open("Error creating contact", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
      this.dialogRef.close();
      return;
    }

    this._snackBar.open("Contact created", "Dismiss", {
      duration: 5000,
    });
  }
}
