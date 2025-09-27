import { Component, inject } from '@angular/core';
import { Theme } from '@core/services';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-theme-button',
  imports: [Button],
  template: `
    <p-button
      (onClick)="onClick()"
      [icon]="themeService.isDark() ? 'fa-regular fa-moon text-yellow-200' : 'fa-regular fa-sun'"
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
