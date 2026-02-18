import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url = environment.googleLoginUrl

  constructor(private http: HttpClient) { }

  loginGooglePopup(): Promise<void> {
    return new Promise((resolve, reject) => {

      const width = 500;
      const height = 600;

      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `${this.url}/login/google`,
        'GoogleLogin',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject('Popup blocked');
        return;
      }

      const handler = (event: MessageEvent) => {
        const backendOrigin = new URL(this.url).origin;

        if (event.origin !== backendOrigin) {
          return;
        }
        const { accessToken, refreshToken, user, success } = event.data;
        if (!success || !accessToken) {
          reject('Login failed');
          popup.close();
          window.removeEventListener('message', handler);
          return;
        }
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        localStorage.setItem('user', JSON.stringify(user));
        window.removeEventListener('message', handler);
        popup.close();

        resolve();
      };
      window.addEventListener('message', handler);
    });
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    window.location.href = '/sign-in';
  }

  refreshToken() {
    const refreshToken = this.getRefreshToken();
    return this.http.post<any>(`${this.url}/auth/refresh`, { refreshToken });
  }


  setAccessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }



}
