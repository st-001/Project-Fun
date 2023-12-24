import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
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
  constructor(private http: HttpClient) {}

  createNewClient(
    client: { name: string; isEnabled: boolean },
  ): Observable<Client> {
    return this.http.post<Client>(`/api/clients`, client);
  }

  getAll(): Observable<Client[]> {
    return this.http.get<Client[]>(`/api/clients`);
  }
}
