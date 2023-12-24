import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface Contact {
  id: number;
  name: string;
  emailAddress: string;
  isEnabled: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

@Injectable({ providedIn: "root" })
export class ContactService {
  constructor(private http: HttpClient) {}

  createNewContact(
    contact: { name: string; emailAddress: string; isEnabled: boolean },
  ): Observable<Contact> {
    return this.http.post<Contact>(`/api/contacts`, contact);
  }

  getAll(): Observable<Contact[]> {
    return this.http.get<Contact[]>(`/api/contacts`);
  }
}
