import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {

  private baseUrl = environment.googleLoginUrl;
  private historyCache$?: Observable<any[]>;
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: '*/*',
      'ngrok-skip-browser-warning': 'true'
    });
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return headers;
  }

  getData(): Observable<any[]> {
    if (!this.historyCache$) {
      this.historyCache$ = this.http
        .get<any[]>(`${this.baseUrl}/contents/history`, {
          headers: this.getHeaders()
        })
        .pipe(shareReplay(1));
    }

    return this.historyCache$;
  }

  clearCache() {
    this.historyCache$ = undefined;
  }
}