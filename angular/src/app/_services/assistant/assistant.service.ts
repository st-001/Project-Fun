import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class AssistantService {
  http = inject(HttpClient);

  startConversation(payload: {
    entityType: string;
    entityId: string;
    message: string;
  }): Observable<any> {
    return this.http.post<any>(`/api/assistant`, payload);
  }
}
