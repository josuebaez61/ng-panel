import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LANGUAGE_OPTIONS_TOKEN } from '@core/providers';
import { CURRENT_LANG_TOKEN } from '@core/providers/current_lang.provider';
import { TranslateService } from '@ngx-translate/core';
import { CommonPrimeNgModule } from '@shared/modules';

@Component({
  selector: 'app-lang-selector',
  imports: [CommonPrimeNgModule, FormsModule],
  template: `
    <p-select
      (onChange)="onChange($event)"
      [ngModel]="currentLang$ | async"
      [options]="languageOptions"
      optionLabel="label"
      optionValue="value"
    >
      <ng-template #selectedItem let-selectedOption>
        <div class="flex items-center gap-2" *ngIf="selectedOption">
          <img [src]="selectedOption.src" style="width: 18px" />
          <div>{{ selectedOption.value }}</div>
        </div>
      </ng-template>
      <ng-template let-lang #item>
        <div class="flex items-center gap-2">
          <img [src]="lang.src" style="width: 18px" />
          <div>{{ lang.value }}</div>
        </div>
      </ng-template>
    </p-select>
  `,
  styles: ``,
})
export class LangSelector {
  public languageOptions = inject(LANGUAGE_OPTIONS_TOKEN);
  public translateService = inject(TranslateService);
  public currentLang$ = inject(CURRENT_LANG_TOKEN);

  public onChange(event: any) {
    this.translateService.use(event.value);
  }
}
