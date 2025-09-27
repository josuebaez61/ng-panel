import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';

export const timezoneInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const modifiedReq = req.clone({
    setHeaders: {
      'X-Timezone': timezone,
    },
  });

  return next(modifiedReq);
};
