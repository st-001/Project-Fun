import { Component, inject, OnInit } from "@angular/core";
import { Client, ClientService } from "../_services/client/client.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";

// export interface Client {
//   id: number;
//   name: string;
//   isEnabled: boolean;
//   createdAt: string;
//   updatedAt: string;
//   deletedAt: string | null;
// }

@Component({
  selector: "app-clients",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    DatePipe,
    MatButtonModule,
  ],
  templateUrl: "./clients.component.html",
  styleUrl: "./clients.component.scss",
})
export class ClientsComponent implements OnInit {
  refreshClients() {
    throw new Error("Method not implemented.");
  }
  exportClients() {
    throw new Error("Method not implemented.");
  }
  createNewClient() {
    throw new Error("Method not implemented.");
  }
  private clientService = inject(ClientService);
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
    "createdAt",
    "updatedAt",
    "deletedAt",
  ];
  constructor() {}

  async getAllClients() {
    const clients = await firstValueFrom(this.clientService.getAll());
    return clients;
  }

  async ngOnInit() {
    const clients = await this.getAllClients();
    this.dataSource.data = clients;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
