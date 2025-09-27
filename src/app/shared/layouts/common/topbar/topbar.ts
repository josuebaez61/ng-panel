import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthLayout } from '@core/services';
import { LangSelector } from '@shared/components/lang-selector/lang-selector';
import { ThemeButton } from '@shared/components/theme-button/theme-button';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { CommonPrimeNgModule } from '@shared/modules';
import { ToolbarModule } from 'primeng/toolbar';
import { UserMenu } from '@shared/components/user-menu/user-menu';

@Component({
  selector: 'app-topbar',
  imports: [CommonPrimeNgModule, ToolbarModule, LangSelector, ThemeButton, RouterLink, UserMenu],
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss',
})
export class Topbar {
  public authLayout = inject(AuthLayout);
}
