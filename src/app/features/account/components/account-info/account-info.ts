import { Component, effect, inject, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthUser } from '@core/models';
import { DialogService, UserService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { FormField } from '@shared/components/ui/form-field/form-field';
import { Label } from '@shared/components/ui/label/label';
import { ControlError } from '@shared/components/ui/control-error/control-error';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { CustomValidators } from '@shared/utils';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    FormField,
    Label,
    ControlError,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
    PanelModule,
  ],
  templateUrl: './account-info.html',
  styleUrl: './account-info.scss',
})
export class AccountInfo {
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);

  // Input signal for the current user
  public user = input.required<AuthUser | null>();

  public usernameControl = new FormControl('', [CustomValidators.username]);

  public emailControl = new FormControl('', [CustomValidators.email]);

  public passwordControl = new FormControl('************');

  constructor() {
    effect(() => {
      this.usernameControl.setValue(this.user()?.username || '');
      this.emailControl.setValue(this.user()?.email || '');
    });
  }

  public onSaveUsername(): void {
    if (this.usernameControl.invalid) {
      this.usernameControl.markAsTouched();
    } else {
      this.userService
        .updateCurrentUserData({ username: this.usernameControl.value } as unknown as AuthUser)
        .subscribe({
          next: () => {
            this.usernameControl.markAsPristine();
          },
        });
    }
  }

  public openChangePasswordDialog(): void {
    this.dialogService.openChangePasswordDialog();
  }

  public openChangeEmailDialog(): void {
    this.dialogService.openChangeEmailDialog();
  }
}
