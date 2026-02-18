import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private googleUrl = environment.googleLoginUrl

  constructor(private http: HttpClient) { }

  loginGooglePopup(): Promise<void> {
    return new Promise((resolve, reject) => {

      const width = 500;
      const height = 600;

      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `${this.googleUrl}/login/google`,
        'GoogleLogin',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        reject('Popup blocked');
        return;
      }

      const handler = (event: MessageEvent) => {
        console.log('🔥 message received:', event);
        const backendOrigin = new URL(this.googleUrl).origin;

        if (event.origin !== backendOrigin) {
          console.log('❌ origin ไม่ตรง:', event.origin);
          return;
        }
        const { accessToken, refreshToken, user, success } = event.data;
        if (!success || !accessToken) {
          reject('Login failed');
          popup.close();
          window.removeEventListener('message', handler);
          return;
        }
        console.log('🎉 Login success');
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



}
