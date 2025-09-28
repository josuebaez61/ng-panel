import { Component, inject, input, signal } from '@angular/core';
import { UserAvatar } from '../user-avatar/user-avatar';
import { MenuModule } from 'primeng/menu';
import { LocalizedMenu } from '@core/services';
import { AsyncPipe, NgClass } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
@Component({
  selector: 'app-user-menu',
  imports: [NgClass, AsyncPipe, UserAvatar, MenuModule, RippleModule],
  template: `
    <div #container class="relative">
      <div (click)="menu.toggle($event)" class="flex items-center" [ngClass]="class()" pRipple>
        <app-user-avatar [size]="3" />
      </div>
      <p-menu
        #menu
        [model]="(items$ | async) || []"
        [popup]="true"
        [appendTo]="container"
        styleClass="!left-[-200px] !top-12 fixed"
      />
    </div>
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
