import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Client } from "../client/client.service";

export interface Contact {
  id: number;
  name: string;
  emailAddress: string;
  client: Client;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class ContactService {
  http = inject(HttpClient);

  createNewContact(
    contact: {
      name: string;
      emailAddress: string;
      clientId: number;
      isEnabled: boolean;
    },
  ): Observable<Contact> {
    return this.http.post<Contact>(`/api/contacts`, contact);
  }

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`/api/contacts`);
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`/api/contacts/${id}`);
  }

  updateContactById(
    id: number,
    contact: {
      name: string;
      emailAddress: string;
      clientId: number;
      isEnabled: boolean;
    },
  ): Observable<Contact> {
    return this.http.put<Contact>(`/api/contacts/${id}`, contact);
  }
}
