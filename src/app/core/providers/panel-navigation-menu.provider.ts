import { InjectionToken, Provider } from '@angular/core';
import { RoutePath } from '@core/constants';
import { PermissionName } from '@core/models';
import { AuthService, LocalizedMenu } from '@core/services';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';

export const PANEL_NAVIGATION_MENU_TOKEN = new InjectionToken<Observable<MenuItem[]>>(
  'PANEL_NAVIGATION_MENU_TOKEN'
);

export const providePanelNavigationMenu = (): Provider => {
  return {
    provide: PANEL_NAVIGATION_MENU_TOKEN,
    useFactory: (localizedMenu: LocalizedMenu, authService: AuthService) => {
      return localizedMenu.getMenu([
        {
          label: 'navigation.dashboard',
          items: [
            {
              label: 'navigation.home',
              icon: 'pi pi-home',
              routerLink: RoutePath.HOME,
            },
            {
              label: 'navigation.company',
              icon: 'pi pi-building',
              visible: authService
                .currentUser()
                ?.hasAnyPermission([PermissionName.READ_COMPANY, PermissionName.UPDATE_COMPANY]),
              routerLink: RoutePath.COMPANY,
            },
            {
              label: 'navigation.users',
              icon: 'pi pi-users',
              visible: authService.currentUser()?.hasPermission(PermissionName.READ_USER),
              routerLink: RoutePath.USERS,
            },
            {
              label: 'navigation.roles',
              icon: 'pi pi-circle',
              visible: authService.currentUser()?.hasPermission(PermissionName.READ_ROLE),
              routerLink: RoutePath.ROLES,
            },
            {
              label: 'navigation.apiKeys',
              icon: 'pi pi-key',
              visible: authService.currentUser()?.hasPermission(PermissionName.READ_API_KEY),
              routerLink: RoutePath.API_KEYS,
            },
            {
              label: 'navigation.settings',
              icon: 'pi pi-cog',
              visible: authService
                .currentUser()
                ?.hasAnyPermission([
                  PermissionName.READ_COMPANY_SETTINGS,
                  PermissionName.UPDATE_COMPANY_SETTINGS,
                ]),
              routerLink: RoutePath.SETTINGS,
            },
          ],
        },
      ]);
    },
    deps: [LocalizedMenu, AuthService],
  };
};
