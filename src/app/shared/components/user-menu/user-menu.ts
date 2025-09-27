import { Component, inject, input, signal } from '@angular/core';
import { UserAvatar } from '../user-avatar/user-avatar';
import { MenuModule } from 'primeng/menu';
import { LocalizedMenu } from '@core/services';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-user-menu',
  imports: [NgClass, AsyncPipe, UserAvatar, MenuModule],
  template: `
    <div class="flex items-center" [ngClass]="class()">
      <app-user-avatar (click)="menu.toggle($event)" [size]="2" />
    </div>
    <p-menu #menu [model]="(items$ | async) || []" [popup]="true" />
  `,
  styles: ``,
})
export class UserMenu {
  private readonly localizedMenu = inject(LocalizedMenu);
  public class = input<string>();
  public items$ = this.localizedMenu.getMenu([
    {},
    {
      label: 'usersMenu.logout',
      icon: 'fa-solid fa-right-from-bracket',
    },
  ]);
}
