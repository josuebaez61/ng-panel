import { Component, computed, input } from '@angular/core';
import { User } from '@core/models';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user-avatar',
  imports: [AvatarModule],
  template: `
    <p-avatar
      [style.height]="size() + 'rem'"
      [style.width]="size() + 'rem'"
      [shape]="'circle'"
      [image]="user()?.profilePicture"
      [label]="user()?.profilePicture ? '' : getInitials()"
      [style.font-size]="textSizeStyleClass()"
    />
  `,
  styles: ``,
})
export class UserAvatar {
  public size = input<number>(3);
  public user = input<User | null>(null);
  public textSizeStyleClass = computed(() => `${this.size() * 5}px`);

  public getInitials(): string {
    const user = this.user();
    if (!user) {
      return '';
    }
    return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
  }
}
