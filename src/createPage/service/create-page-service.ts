import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class CreatePageService {

  private url = environment.googleLoginUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    let token = null;
    if (typeof window !== 'undefined') {
      token = localStorage.getItem('accessToken');
    }
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  generateContentFromN8n(payload: any) {
    return this.http.post<any>(`${this.url}/contents`, payload, { headers: this.getHeaders() });
  }



}

