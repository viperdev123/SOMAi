import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { definePreset } from '@primeng/themes';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import { provideLottieOptions } from 'ngx-lottie';
import player from 'lottie-web';
import { routes } from './app.routes';
import { authInterceptor } from './layouts/auth-layout/service/auth.interceptor';

const MyBlackFocusTheme = definePreset(Lara, {
  semantic: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#1E3A8A', // ⭐ focus จะใช้ค่านี้
      600: '#1E40AF',
      700: '#1E3A8A',
      800: '#172554',
      900: '#0f172a'
    }
  }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ scrollPositionRestoration: 'top' })),
    provideClientHydration(withEventReplay()),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),


    providePrimeNG({
      theme: {
        preset: MyBlackFocusTheme,
        options: {
          darkModeSelector: 'body'
        }
      }
    }),

    provideLottieOptions({
      player: () => player
    })
  ]
};
