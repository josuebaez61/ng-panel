import { Component, input, output } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-panel-drawer',
  imports: [DrawerModule],
  templateUrl: './panel-drawer.html',
  styleUrl: './panel-drawer.scss',
})
export class PanelDrawer {
  public drawerVisible = input<boolean>(true);
  public drawerVisibleChange = output<boolean>();
  public drawerWidth = input<string>('300px');
}
