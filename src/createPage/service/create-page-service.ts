import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CreatePageService {

  private n8nUrl = environment.n8nUrl;
  private token = environment.n8nToken;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  generateContentFromN8n(payload: any) {
    return this.http.post<any>(`${this.n8nUrl}/webhook/SOMAi/create-content`, payload, { headers: this.getHeaders() });
  }

  pollingData(payload: any) {
    return this.http.post<any>(`${this.n8nUrl}/webhook/SOMAi/check-status`, payload, { headers: this.getHeaders() });
  }

}

