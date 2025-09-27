import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { Theme } from '@core/services';
import { Card } from 'primeng/card';
import { Topbar } from '../common/topbar/topbar';

@Component({
  selector: 'app-auth',
  imports: [RouterOutlet, CommonModule, FormsModule, CheckboxModule, Card, Topbar],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth implements OnInit {
  isDarkMode = false;
  private themeService = inject(Theme);

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
