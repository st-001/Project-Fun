import { Component, inject } from "@angular/core";
import {
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
import { ClientService } from "../_services/client/client.service";
import { firstValueFrom } from "rxjs";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-create-new-client-dialog",
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
  templateUrl: "./create-new-client-dialog.component.html",
  styleUrl: "./create-new-client-dialog.component.scss",
})
export class CreateNewClientDialogComponent {
  clientService: ClientService = inject(ClientService);
  dialogRef: MatDialogRef<CreateNewClientDialogComponent> = inject(
    MatDialogRef,
  );
  snackBar: MatSnackBar = inject(MatSnackBar);
  createNewClientForm = new FormGroup({
    name: new FormControl("", [Validators.required]),
    isEnabled: new FormControl(true),
  });

  async submitForm() {
    let result;
    try {
      result = await firstValueFrom(this.clientService.createNewClient({
        name: this.createNewClientForm.value.name!,
        isEnabled: this.createNewClientForm.value.isEnabled!,
      }));
      this.snackBar.open("Client created", "Dismiss", {
        duration: 5000,
      });
    } catch (error) {
      this.snackBar.open("Error creating client", "Dismiss", {
        duration: 5000,
      });
      console.error(error);
    } finally {
      this.dialogRef.close(result);
    }
  }
}
