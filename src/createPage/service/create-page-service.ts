import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CreatePageService {

  private n8nUrl = 'https://chronic-midnight-strategy-dsc.trycloudflare.com';

  constructor(private http: HttpClient) { }

  generateContentFromN8n(payload: any) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer SOMA_FbJWhMmmakSJGao2XTWp54VomSYfERoyYQjTM88fS9lKO2IFGsScYqttAVdjs6D7',
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.n8nUrl+ '/webhook/SOMAi-home', payload, { headers, observe: 'body' });
  }
  
}
