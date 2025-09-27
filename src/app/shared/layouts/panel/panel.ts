import { Component, output, signal } from '@angular/core';
import { Topbar } from '../common/topbar/topbar';
import { RouterModule } from '@angular/router';
import { DrawerModule } from 'primeng/drawer';
import { PanelDrawer } from './panel-drawer/panel-drawer';

@Component({
  selector: 'app-panel',
  imports: [Topbar, RouterModule, DrawerModule, PanelDrawer],
  templateUrl: './panel.html',
  styleUrl: './panel.scss',
})
export class Panel {
  public drawerVisible = signal<boolean>(true);
  public drawerWidth = signal<string>('300px');

  public toggleSidenav() {
    this.drawerVisible.set(!this.drawerVisible());
  }
}
