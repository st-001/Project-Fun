import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import { Client, ClientService } from "../_services/client/client.service";
import { firstValueFrom } from "rxjs";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { CreateNewClientDialogComponent } from "../create-new-client-dialog/create-new-client-dialog.component";
import { defaultMatDialogTop } from "../util";
import { Router } from "@angular/router";

@Component({
  selector: "app-clients",
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
  templateUrl: "./clients.component.html",
  styleUrl: "./clients.component.scss",
})
export class ClientsComponent {
  router = inject(Router);
  dialog = inject(MatDialog);
  clientService = inject(ClientService);
  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = [
    "name",
    "isEnabled",
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

  onRowClick(client: Client) {
    this.router.navigate(["/clients", client.id]);
  }

  exportClients() {
    throw new Error("Method not implemented.");
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  async getAllClients() {
    this.dataSource.data = await firstValueFrom(this.clientService.getAll());
  }

  async ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    await this.getAllClients();
  }

  async openCreateNewClientDialog() {
    const dialogRef = this.dialog.open(CreateNewClientDialogComponent, {
      width: "500px",
      position: {
        top: defaultMatDialogTop,
      },
    });

    const result = await firstValueFrom(dialogRef.afterClosed()) as Client;
    if (result) {
      await this.getAllClients();
    }
  }
}
