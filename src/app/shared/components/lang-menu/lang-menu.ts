import { AsyncPipe } from '@angular/common';
import { Component, inject, linkedSignal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { LanguageOption } from '@core/models';
import { LANGUAGE_OPTIONS_TOKEN } from '@core/providers';
import { CURRENT_LANG_TOKEN } from '@core/providers/current_lang.provider';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Button, ButtonDirective, ButtonIcon } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { map } from 'rxjs';

@Component({
  selector: 'app-lang-menu',
  imports: [Menu, AsyncPipe, ButtonDirective, ButtonIcon],
  template: `
    <button pButton text rounded (click)="menu.toggle($event)">
      @if (selectedLang$ | async; as lang) {
      <img pButtonIcon [src]="lang.icon" style="width: 18px" />
      }
    </button>

    <p-menu #menu [model]="languageOptions" [popup]="true">
      <ng-template #item let-lang>
        <div (click)="onChange(lang)" class="flex items-center gap-2 cursor-pointer py-2 px-4">
          <img [src]="lang.icon" style="width: 18px" />
          <div>{{ lang.label }} ({{ lang.value }})</div>
        </div>
      </ng-template>
    </p-menu>
  `,
  styles: ``,
})
export class LangMenu {
  public languageOptions = inject(LANGUAGE_OPTIONS_TOKEN).map<MenuItem>((el) => ({
    label: el.label,
    value: el.value,
    icon: el.src,
  }));
  public translateService = inject(TranslateService);
  public currentLang$ = inject(CURRENT_LANG_TOKEN);
  public selectedLang$ = this.currentLang$.pipe(
    map((lang) => this.languageOptions.find((el) => el['value'] === lang)!)
  );

  public onChange(event: any) {
    this.translateService.use(event.value);
  }
}
