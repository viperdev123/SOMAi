import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ReviewService {

  private data: any = null;
  private url = environment.googleLoginUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getToken(): string | null {
    if (!this.isBrowser) return null;
    return localStorage.getItem('accessToken');
  }

  private getHeaders(): HttpHeaders {
    const token = this.getToken();

    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    });
  }

  private getMultipartHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': token ? `Bearer ${token}` : '',
      'accept': '*/*'
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

  submit(payload: FormData) {
    return this.http.post<any>(`${this.url}/contents/submit`, payload, { headers: this.getMultipartHeaders() });
  }


}
