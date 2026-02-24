import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    if (req.url.includes('/auth/refresh')) {
        return next(req);
    }
    const accessToken = authService.getAccessToken();
    let authReq = req;
    if (accessToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status !== 401) {
                return throwError(() => error);
            }
            const refreshToken = authService.getRefreshToken();
            if (!refreshToken) {
                authService.logout();
                return throwError(() => error);
            }
            return authService.refreshToken().pipe(
                switchMap((res: any) => {
                    if (!res.success) {
                        authService.logout();
                        return throwError(() => res);
                    }
                    const newAccessToken = res.data.accessToken;
                    authService.setAccessToken(newAccessToken);
                    const retryReq = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                    return next(retryReq);
                }),
                catchError((refreshError) => {
                    authService.logout();
                    return throwError(() => refreshError);
                })
            );
        })
    );
};
