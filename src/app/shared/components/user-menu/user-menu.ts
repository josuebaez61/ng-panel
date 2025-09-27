import { Component, inject, input, signal } from '@angular/core';
import { UserAvatar } from '../user-avatar/user-avatar';
import { MenuModule } from 'primeng/menu';
import { LocalizedMenu } from '@core/services';
import { AsyncPipe } from '@angular/common';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-user-menu',
  imports: [AsyncPipe, UserAvatar, MenuModule, Button],
  template: `
    <div class="flex items-center" [class]="class()">
      <div class="cursor-pointer" (click)="menu.toggle($event)">
        <p-button styleClass="p-0" size="small" text>
          <app-user-avatar [size]="2" />
        </p-button>
      </div>
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
