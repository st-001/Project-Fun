import { Component, inject } from "@angular/core";
import { Client, ClientService } from "../_services/client/client.service";
import { firstValueFrom } from "rxjs";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { DatePipe } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";

@Component({
  selector: "app-client",
  standalone: true,
  imports: [
    MatCardModule,
    DatePipe,
    MatButtonModule,
    RouterLink,
    MatTabsModule,
  ],
  templateUrl: "./client.component.html",
  styleUrl: "./client.component.scss",
})
export class ClientComponent {
  refreshNotes() {
    throw new Error("Method not implemented.");
  }
  refreshClient() {
    throw new Error("Method not implemented.");
  }
  openEditClientDialog() {
    throw new Error("Method not implemented.");
  }
  router = inject(Router);
  route = inject(ActivatedRoute);
  clientService = inject(ClientService);
  client: Client | undefined;
  constructor() {}

  async ngOnInit() {
    const clientId = Number(this.route.snapshot.paramMap.get("id"));
    try {
      this.client = await firstValueFrom(
        this.clientService.getClientById(clientId),
      );
    } catch (error: any) {
      if (error.status === 404) {
        this.router.navigate(["/clients"]);
      }
    }
  }
}
