import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Client {
  id: number;
  name: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class ClientService {
  http = inject(HttpClient);

  createNewClient(
    client: { name: string; isEnabled: boolean },
  ): Observable<Client> {
    return this.http.post<Client>(`/api/clients`, client);
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`/api/clients`);
  }

  getClientById(id: number): Observable<Client> {
    return this.http.get<Client>(`/api/clients/${id}`);
  }

  updateClientById(
    id: number,
    client: { name: string; isEnabled: boolean },
  ): Observable<Client> {
    return this.http.put<Client>(`/api/clients/${id}`, client);
  }
}
