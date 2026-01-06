import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { SharedModule } from '@shared/modules';
import { AuthService, LocalizedMenu, ThemeService } from '@core/services';
import { RoutePath } from '@core/constants';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';
import { UserAvatar } from '@shared/components/user/user-avatar/user-avatar';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PermissionName } from '@core/models';

@Component({
  selector: 'app-panel-drawer',
  imports: [
    DrawerModule,
    AvatarModule,
    BadgeModule,
    SharedModule,
    PanelMenuModule,
    MenuModule,
    UserAvatar,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './panel-drawer.html',
  styleUrl: './panel-drawer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PanelDrawer {
  private readonly theme = inject(ThemeService);
  private readonly authService = inject(AuthService);

  public isDark = computed(() => this.theme.isDark());

  public user = computed(() => this.authService.currentUser());
  public userName = computed(() => this.user()?.username);
  public drawerVisible = input<boolean>(true);
  public drawerVisibleChange = output<boolean>();
  public drawerWidth = input<string>('300px');
  public modal = input<boolean>(false);

  public accountRoute = RoutePath.ACCOUNT;

  public closeCallback = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.drawerVisibleChange.emit(false);
  };

  private readonly localizedMenu = inject(LocalizedMenu);

  public menuItems$ = this.localizedMenu.getMenu([
    {
      label: 'menu.dashboard',
      items: [
        {
          label: 'menu.home',
          icon: 'pi pi-home',
          routerLink: RoutePath.HOME,
        },
        {
          label: 'menu.users',
          icon: 'pi pi-users',
          visible: this.authService.currentUser()?.hasPermission(PermissionName.READ_USER),
          routerLink: RoutePath.USERS,
        },
        {
          label: 'menu.roles',
          icon: 'pi pi-circle',
          visible: this.authService.currentUser()?.hasPermission(PermissionName.READ_ROLE),
          routerLink: RoutePath.ROLES,
        },
        {
          label: 'menu.apiKeys',
          icon: 'pi pi-key',
          visible: this.authService.currentUser()?.hasPermission(PermissionName.READ_API_KEY),
          routerLink: RoutePath.API_KEYS,
        },
      ],
    },
  ]);
}
