import { Component, inject } from "@angular/core";
import { Client, ClientService } from "../_services/client/client.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialog } from "@angular/material/dialog";
import { EditClientDialogComponent } from "../edit-client-dialog/edit-client-dialog.component";
import { defaultMatDialogTop } from "../util";
import { NotesComponent } from "../notes/notes.component";

@Component({
  selector: "app-client",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
    NotesComponent,
  ],
  templateUrl: "./client.component.html",
  styleUrl: "./client.component.scss",
})
export class ClientComponent {
  router = inject(Router);
  route = inject(ActivatedRoute);
  dialog = inject(MatDialog);
  clientService = inject(ClientService);
  client: Client | undefined;
  clientId = Number(this.route.snapshot.paramMap.get("id"));

  async ngOnInit() {
    await this.getClient();
  }

  async getClient() {
    try {
      this.client = await firstValueFrom(
        this.clientService.getClientById(this.clientId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/clients"]);
      }
    }
  }

  async openEditClientDialog() {
    const dialogRef = this.dialog.open(EditClientDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
      data: {
        clientId: this.clientId,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Client;
    if (result) {
      await this.getClient();
    }
  }
}
