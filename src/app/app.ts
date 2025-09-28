import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EN_LANGUAGE, ES_LANGUAGE } from '@core/constants';
import { LANGUAGE_OPTIONS_TOKEN } from '@core/providers';
import { StorageService, Theme } from '@core/services';
import { TranslateService } from '@ngx-translate/core';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ConfirmPopupModule, ConfirmDialogModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private themeService = inject(Theme);
  private translateService = inject(TranslateService);
  private storageService = inject(StorageService);
  private languageOptions = inject(LANGUAGE_OPTIONS_TOKEN);
  private fallbackLang = EN_LANGUAGE;

  constructor() {
    this.themeService.loadTheme();
    this.initializeTranslations();
  }

  private initializeTranslations(): void {
    this.translateService.addLangs(this.languageOptions.map((option) => option.value));
    this.updateNgxTranslateFallbackLang();

    const storageLang = this.storageService.getLang();

    if (storageLang) {
      this.translateService.use(storageLang);
    }

    this.translateService.onLangChange.subscribe((lang) => {
      document.documentElement.lang = lang.lang;
      this.storageService.setLang(lang.lang);
    });
  }

  private isValidLang(lang: string): boolean {
    return this.translateService.getLangs().includes(lang);
  }

  private updateNgxTranslateFallbackLang(): void {
    const fallbackLang =
      navigator.language?.split('-')[0] ||
      navigator.languages?.[0]?.split('-')[0] ||
      this.fallbackLang;

    if (this.isValidLang(fallbackLang)) {
      this.translateService.setFallbackLang(fallbackLang);
    } else {
      this.translateService.setFallbackLang(this.fallbackLang);
    }
  }
}
