import { Component, inject, input, output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { AvatarModule } from 'primeng/avatar';
import { CommonPrimeNgModule } from '@shared/modules';
import { LocalizedMenu } from '@core/services';
import { RoutePath } from '@core/constants';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuModule } from 'primeng/menu';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-panel-drawer',
  imports: [
    DrawerModule,
    AvatarModule,
    BadgeModule,
    CommonPrimeNgModule,
    PanelMenuModule,
    MenuModule,
  ],
  templateUrl: './panel-drawer.html',
  styleUrl: './panel-drawer.scss',
})
export class PanelDrawer {
  public drawerVisible = input<boolean>(true);
  public drawerVisibleChange = output<boolean>();
  public drawerWidth = input<string>('300px');
  public modal = input<boolean>(false);

  public closeCallback = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    this.drawerVisibleChange.emit(false);
  };

  private readonly localizedMenu = inject(LocalizedMenu);

  public menuItems$ = this.localizedMenu.getMenu([
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: RoutePath.DASHBOARD,
      items: [
        {
          label: 'Dashboard',
          icon: 'pi pi-home',
          route: RoutePath.DASHBOARD,
        },
      ],
    },
  ]);
}
