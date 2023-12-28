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
import { Client, ClientService } from "../_services/client/client.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ClientSelectSearchComponent } from "../_fields/client-select-search/client-select-search.component";

@Component({
  selector: "app-edit-client-dialog",
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
  templateUrl: "./edit-client-dialog.component.html",
  styleUrl: "./edit-client-dialog.component.scss",
})
export class EditClientDialogComponent {
  clientService: ClientService = inject(ClientService);
  dialogRef: MatDialogRef<EditClientDialogComponent> = inject(MatDialogRef);
  snackBar: MatSnackBar = inject(MatSnackBar);
  dialogInputData: { clientId: number } = inject(MAT_DIALOG_DATA);
  client: Client | undefined;
  editClientForm: FormGroup | undefined;

  async ngOnInit() {
    this.client = await firstValueFrom(
      this.clientService.getClientById(this.dialogInputData.clientId),
    );
    this.editClientForm = new FormGroup({
      name: new FormControl(this.client.name, [Validators.required]),
      isEnabled: new FormControl(this.client.isEnabled),
    });
  }

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(
        this.clientService.updateClientById(this.client!.id, {
          name: this.editClientForm!.value.name!,
          isEnabled: this.editClientForm!.value.isEnabled!,
        }),
      );
      this.snackBar.open("Client updated.", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error updating client.", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
