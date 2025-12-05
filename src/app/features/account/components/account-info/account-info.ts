import { Component, inject, input, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { Card } from 'primeng/card';

@Component({
  selector: 'app-account-info',
  standalone: true,
  imports: [
    Card,
    ReactiveFormsModule,
    TranslateModule,
    FormField,
    Label,
    ControlError,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
  ],
  templateUrl: './account-info.html',
  styleUrl: './account-info.scss',
})
export class AccountInfo implements OnInit {
  private readonly userService = inject(UserService);
  private readonly dialogService = inject(DialogService);

  // Input signal for the current user
  public user = input.required<AuthUser | null>();

  // Public form group that parent components can access
  public form = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  });

  ngOnInit(): void {
    this.patchForm();
  }

  public patchForm(): void {
    this.form.patchValue({
      username: this.user()?.username || '',
    });
  }

  public onSaveUsername(): void {
    this.userService
      .updateCurrentUserData(this.form.getRawValue() as unknown as AuthUser)
      .subscribe({
        next: () => {
          this.form.markAsPristine();
        },
      });
  }

  public openChangePasswordDialog(): void {
    this.dialogService.openChangePasswordDialog()?.onClose?.subscribe((result) => {
      console.log(result);
    });
  }

  public openChangeEmailDialog(): void {
    this.dialogService.openChangeEmailDialog()?.onClose?.subscribe((result) => {
      console.log(result);
    });
  }
}
