import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import Aura from '@primeuix/themes/aura';
import Material from '@primeuix/themes/material';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  apiMessageInterceptor,
  authInterceptor,
  globalLoadingInterceptor,
  languageInterceptor,
  timezoneInterceptor,
} from '@core/interceptors';
import { provideLanguageOptions, provideTranslateConfig } from '@core/providers';
import { MessageService } from 'primeng/api';
import { THEME_DARK_CSS_CLASS_NAME } from '@core/constants';
import { Noir } from '@core/themes';
import { provideCurrentLang } from '@core/providers/current_lang.provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),

    // PrimeNG
    providePrimeNG({
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: `.${THEME_DARK_CSS_CLASS_NAME}`,
        },
      },
    }),

    // HTTP Client
    provideHttpClient(
      withInterceptors([
        globalLoadingInterceptor,
        authInterceptor,
        languageInterceptor,
        timezoneInterceptor,
        apiMessageInterceptor,
      ])
    ),

    // Internationalization
    provideTranslateConfig(),

    // Toast
    MessageService,

    // Language options
    provideLanguageOptions(),

    // Current lang
    provideCurrentLang(),
  ],
};
function provideNativeDateAdapter() {
  throw new Error('Function not implemented.');
}
