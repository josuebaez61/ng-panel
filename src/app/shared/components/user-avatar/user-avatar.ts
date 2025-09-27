import { Component, input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user-avatar',
  imports: [AvatarModule],
  template: `
    <p-avatar [style.height]="size() + 'rem'" [style.width]="size() + 'rem'" [shape]="'circle'" />
  `,
  styles: ``,
})
export class UserAvatar {
  public size = input<number>(3);
}
