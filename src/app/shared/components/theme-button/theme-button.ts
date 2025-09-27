import { Component, inject } from '@angular/core';
import { Theme } from '@core/services';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-theme-button',
  imports: [Button],
  template: `
    <p-button
      (onClick)="onClick()"
      [icon]="'fa-regular fa-lightbulb' + (themeService.isDark() ? ' text-yellow-500' : '')"
      [rounded]="true"
      text
    />
  `,
  styles: ``,
})
export class ThemeButton {
  public themeService = inject(Theme);

  public onClick() {
    this.themeService.toggleTheme();
  }
}
