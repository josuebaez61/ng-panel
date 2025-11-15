import { Component, OnInit, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Theme } from '@core/services';
import { Card } from 'primeng/card';
import { Topbar } from '../common/topbar/topbar';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, CommonModule, FormsModule, CheckboxModule, Card, Topbar, TranslateModule],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  isDarkMode = false;
  private themeService = inject(Theme);

  public companyName = environment.companyName;
  public title = input<string | null>(null);
  public backRoute = input<string | null>(null);
  public showSidenavToggleButton = input<boolean>(false);

  ngOnInit() {}

  toggleTheme() {
    console.log('toggleTheme');
    this.isDarkMode = !this.isDarkMode;
    this.themeService.toggleTheme();
  }

  private applyTheme() {
    if (this.isDarkMode) {
      this.themeService.applyTheme('dark');
    } else {
      this.themeService.applyTheme('light');
    }
  }
}
