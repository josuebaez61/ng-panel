import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  apiMessageInterceptor,
  authInterceptor,
  globalLoadingInterceptor,
  languageInterceptor,
  timezoneInterceptor,
} from '@core/interceptors';
import { provideLanguageOptions, provideTranslateConfig } from '@core/providers';
import { ConfirmationService, MessageService } from 'primeng/api';
import { THEME_DARK_CSS_CLASS_NAME } from '@core/constants';
import { Noir } from '@core/themes';
import { provideCurrentLang } from '@core/providers/current_lang.provider';
import { RippleModule } from 'primeng/ripple';

import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import { DialogService } from 'primeng/dynamicdialog';

registerLocaleData(localeEs);
registerLocaleData(localeEn);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimationsAsync(),

    // PrimeNG
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Noir,
        options: {
          darkModeSelector: `.${THEME_DARK_CSS_CLASS_NAME}`,
          cssLayer: {
            name: 'primeng',
            // Ensure primeng layer is after theme and base, but before the other Tailwind layers such as utilities.
            order: 'base, theme, primeng',
          },
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

    RippleModule,
    ConfirmationService,
    DialogService,
  ],
};
