import { HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const languageInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next) => {
  const translateService = inject(TranslateService);
  const currentLang = translateService.currentLang || 'en';

  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': currentLang,
    },
  });

  return next(modifiedReq);
};
