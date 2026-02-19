import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private url = environment.googleLoginUrl;
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  loginGooglePopup(): Promise<void> {
    return new Promise((resolve, reject) => {

      if (!this.isBrowser) {
        reject('Not in browser');
        return;
      }

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

        if (event.origin !== backendOrigin) return;

        const { accessToken, refreshToken, user, success } = event.data;

        if (!success || !accessToken) {
          reject('Login failed');
          popup.close();
          window.removeEventListener('message', handler);
          return;
        }

        this.setAccessToken(accessToken);
        this.setRefreshToken(refreshToken);
        this.setUser(user);

        window.removeEventListener('message', handler);
        popup.close();
        resolve();
      };

      window.addEventListener('message', handler);
    });
  }

  connectFacebookPopup(): Promise<void> {
    return new Promise((resolve, reject) => {

      if (!this.isBrowser) {
        reject('Not in browser');
        return;
      }

      const width = 500;
      const height = 600;

      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const accessToken = this.getAccessToken();

      if (!accessToken) {
        reject('No access token');
        return;
      }

      const popup = window.open(
        `${this.url}/auth/facebook?token=${accessToken}`,
        'FacebookConnect',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject('Popup blocked');
        return;
      }

      const handler = (event: MessageEvent) => {
        const backendOrigin = new URL(this.url).origin;
        if (event.origin !== backendOrigin) return;

        const { success, message } = event.data;

        if (!success) {
          reject(message || 'Facebook connect failed');
          popup.close();
          window.removeEventListener('message', handler);
          return;
        }

        window.removeEventListener('message', handler);
        popup.close();
        resolve();
      };

      window.addEventListener('message', handler);
    });
  }

  getCurrentUser() {
    if (!this.isBrowser) return null;

    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getAccessToken() {
    if (!this.isBrowser) return null;
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    if (!this.isBrowser) return null;
    return localStorage.getItem('refreshToken');
  }

  logout() {
    if (!this.isBrowser) return;

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
    if (this.isBrowser) {
      localStorage.setItem('accessToken', token);
    }
  }

  setRefreshToken(token: string) {
    if (this.isBrowser) {
      localStorage.setItem('refreshToken', token);
    }
  }

  setUser(user: any) {
    if (this.isBrowser) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  isTokenExpired(token: string | null): boolean {
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      return Date.now() >= exp * 1000;
    } catch {
      return true;
    }
  }
}
