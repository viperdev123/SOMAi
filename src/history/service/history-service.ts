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

    let token = null;

    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('accessToken');
    }

    return new HttpHeaders({
      ...(token && { Authorization: `Bearer ${token}` }),
      Accept: '*/*'
    });
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