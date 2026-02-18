import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  private token =  localStorage.getItem('accessToken');
  private data: any = null;
  private url = environment.googleLoginUrl;

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json'
    });
  }

  setData(data: any) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  clear() {
    this.data = null;
  }

  regenerateContent(payload: any) {
    return this.http.post<any>(`${this.url}/contents/refine`, payload, { headers: this.getHeaders() });
  }
}
