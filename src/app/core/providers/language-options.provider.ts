import { InjectionToken, Provider } from '@angular/core';
import { LanguageOption } from '@core/models';

export const LANGUAGE_OPTIONS_TOKEN = new InjectionToken<LanguageOption[]>('LANGUAGE_OPTIONS');

const LANGUAGE_OPTIONS: LanguageOption[] = [
  { label: 'English', value: 'en-US' },
  { label: 'Español', value: 'es-ES' },
];

export const provideLanguageOptions = (): Provider => {
  return {
    provide: LANGUAGE_OPTIONS_TOKEN,
    useValue: LANGUAGE_OPTIONS,
  };
};
