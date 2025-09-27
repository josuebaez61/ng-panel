import { Injectable, inject } from '@angular/core';
import { CURRENT_LANG_TOKEN } from '@core/providers/current_lang.provider';
import { TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalizedMenu {
  private readonly translateService = inject(TranslateService);
  private readonly currentLang$ = inject(CURRENT_LANG_TOKEN);

  public getMenu(menu: MenuItem[]): Observable<MenuItem[]> {
    return this.currentLang$.pipe(
      map((lang) => {
        return menu.map((item) => ({
          ...item,
          label: item.label ? this.translateService.instant(item.label) : undefined,
        }));
      })
    );
  }
}
