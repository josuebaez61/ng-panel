import { Component, computed, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { FormField } from '@shared/components/form-field/form-field';
import { CommonPrimeNgModule } from '@shared/modules';
import { Label } from '@shared/components/label/label';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, DialogService } from '@core/services';

@Component({
  selector: 'app-account',
  imports: [Card, UserAvatar, FormField, CommonPrimeNgModule, Label, TranslateModule],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public user = computed(() => this.authService.currentUser());

  public openChangePasswordDialog() {
    this.dialogService.openChangePasswordDialog().onClose.subscribe((result) => {
      console.log(result);
    });
  }

  public openChangeEmailDialog() {
    this.dialogService.openChangeEmailDialog().onClose.subscribe((result) => {
      console.log(result);
    });
  }
}
