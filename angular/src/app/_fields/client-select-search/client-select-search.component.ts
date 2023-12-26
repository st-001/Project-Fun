import { Component, inject, Input, ViewChild } from "@angular/core";
import { MatSelect, MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { AsyncPipe } from "@angular/common";
import { FormControl } from "@angular/forms";
import { firstValueFrom, ReplaySubject, Subject, takeUntil } from "rxjs";
import { Client, ClientService } from "../../_services/client/client.service";
import { ReactiveFormsModule } from "@angular/forms";

@Component({
  selector: "app-client-select-search",
  standalone: true,
  imports: [
    MatSelectModule,
    NgxMatSelectSearchModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: "./client-select-search.component.html",
  styleUrl: "./client-select-search.component.scss",
})
export class ClientSelectSearchComponent {
  @Input()
  public placeholder!: string;
  @Input()
  public control!: FormControl;

  clientService = inject(ClientService);
  clients: Client[] = [];
  clientFilterCtrl: FormControl = new FormControl("");
  filteredClients: ReplaySubject<Client[]> = new ReplaySubject<Client[]>(1);
  @ViewChild("clientSelect", { static: true })
  clientSelect!: MatSelect;
  protected _onDestroy = new Subject<void>();

  async ngOnInit() {
    this.clients = await firstValueFrom(this.clientService.getAll());

    this.filteredClients.next(this.clients.slice());

    this.clientFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterClients();
      });
  }

  protected filterClients() {
    if (!this.clients) {
      return;
    }

    let search = this.clientFilterCtrl.value;
    if (!search) {
      this.filteredClients.next(this.clients.slice());
      return;
    } else {
      search = search.toLowerCase();
    }

    this.filteredClients.next(
      this.clients.filter((client) =>
        client.name.toLowerCase().indexOf(search) > -1
      ),
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }
}
