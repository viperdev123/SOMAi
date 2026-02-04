import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistoryService {
  private apiUrl = 'https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLhYwZXXk3D42gPTqoMBkooAxXRKnPq6v0WZtRevD2hXnq0FHVLhWxeuOFd9LTOZXD74zm3lr4BgkcuM_mNEp54YGdtDN3tuy91-GnKOaeZoNsMX43-M868nJ_Q20sVEobna3Zp_Vgy3TG8P8St250u-nt2BRITjTodVqOHQq2ei7Wl92h64MsyZ-2v0kFnvC8r7gTIFwj4sTq6YLkVoHHQFmGm-jU2aquPU5FR0Yk4PswUSQGyJhsxBKj-dC7GHDJaBgqi3qG1JtGMYWn8rBCVApYxP-A&lib=MeuxksbS5gWuk4iVWe1iUiVVK1uA-29o0';
  private historyCache$?: Observable<any[]>;

  constructor(private http: HttpClient) { }

  getData(): Observable<any[]> {
    if (!this.historyCache$) {
      this.historyCache$ = this.http.get<any[]>(this.apiUrl).pipe(
        shareReplay(1) // จำค่าล่าสุดไว้
      );
    }
    return this.historyCache$;
  }

  clearCache() {
    this.historyCache$ = undefined;
  }
}
