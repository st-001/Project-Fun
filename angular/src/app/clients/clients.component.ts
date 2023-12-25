import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from "@angular/core";
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
export class ClientsComponent implements OnInit {
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  @ViewChild(MatSort)
  sort!: MatSort;

  @ViewChild("input")
  inputElement!: ElementRef;

  async refreshClients() {
    const clients = await this.getAllClients();
    this.dataSource.data = clients;
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
  constructor(public dialog: MatDialog) {}

  async getAllClients() {
    const clients = await firstValueFrom(this.clientService.getAll());
    return clients;
  }

  private setupTableFeatures() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  async ngOnInit() {
    const clients = await this.getAllClients();
    this.dataSource.data = clients;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.setupTableFeatures();
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
      await this.refreshClients();
    }
  }
}
