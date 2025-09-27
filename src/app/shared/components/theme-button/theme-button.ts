import { Component, inject } from '@angular/core';
import { Theme } from '@core/services';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-theme-button',
  imports: [Button],
  template: `
    <p-button
      (onClick)="onClick()"
      [icon]="themeService.isDark() ? 'pi pi-moon text-yellow-200' : 'pi pi-sun'"
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
