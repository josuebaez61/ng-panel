import { Component, computed, inject, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/services';
import { LangSelector } from '@shared/components/lang-selector/lang-selector';
import { ThemeButton } from '@shared/components/theme-button/theme-button';
import { CommonPrimeNgModule } from '@shared/modules';
import { ToolbarModule } from 'primeng/toolbar';
import { UserMenu } from '@shared/components/user-menu/user-menu';
import { UserNotificationsButton } from '@shared/components/user-notifications-button/user-notifications-button';
import { LangMenu } from '@shared/components/lang-menu/lang-menu';

@Component({
  selector: 'app-topbar',
  imports: [
    CommonPrimeNgModule,
    ToolbarModule,
    ThemeButton,
    RouterLink,
    UserMenu,
    UserNotificationsButton,
    LangMenu,
  ],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  private readonly authService = inject(AuthService);

  public toggleSidenav = output<void>();
  public backRoute = input<string | null>(null);
  public showSidenavToggleButton = input<boolean>(false);

  public isAuthenticated = computed(() => this.authService.isAuthenticated());
}
