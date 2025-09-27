import { Component, inject, signal } from '@angular/core';
import { UserAvatar } from '../user-avatar/user-avatar';
import { MenuModule } from 'primeng/menu';
import { LocalizedMenu } from '@core/services';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-user-menu',
  imports: [AsyncPipe, UserAvatar, MenuModule],
  template: `
    <div class="flex items-center">
      <div class="cursor-pointer" (click)="menu.toggle($event)">
        <app-user-avatar />
      </div>
    </div>
    <p-menu #menu [model]="(items$ | async) || []" [popup]="true" />
  `,
  styles: ``,
})
export class UserMenu {
  private readonly localizedMenu = inject(LocalizedMenu);
  public items$ = this.localizedMenu.getMenu([
    {
      label: 'usersMenu.logout',
      icon: 'fa-solid fa-right-from-bracket',
    },
  ]);
}
