import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

    //กัน loop เรียก refresh token เรื่อยๆ
    const authService = inject(AuthService);
    if (req.url.includes('/auth/refresh')) {
        return next(req);
    }


    const accessToken = authService.getAccessToken();
    let authReq = req;
    //เช็ค accesstoken ถ้ามีเพิ่ม header accessToken
    if (accessToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`
            }
        });
    }
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {

            //เอาแค่ 401 ถึงเรียก refresh
            if (error.status !== 401) {
                return throwError(() => error);
            }

            const refreshToken = authService.getRefreshToken();
            if (!refreshToken) {
                authService.logout();
                return throwError(() => error);
            }

            //เรียก refresh
            return authService.refreshToken().pipe(switchMap((res: any) => {

                    //refresh ไม่สำเร็จ 
                    if (!res.success) {
                        authService.logout();
                        return throwError(() => res);
                    }


                    const newAccessToken = res.data.accessToken;
                    authService.setAccessToken(newAccessToken);

                    // ยิง api อีกครั้งด้วย accesstoken ใหม่
                    const retryReq = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                    return next(retryReq);
                }),
                catchError((refreshError) => {
                    authService.logout();

                    //โยน error ไปให้ caller
                    return throwError(() => refreshError);
                })
            );
        })
    );
};
