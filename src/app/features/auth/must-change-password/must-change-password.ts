import { Component, OnInit, inject, signal } from '@angular/core';
import { Label } from '@shared/components/ui/label/label';
import { ControlError } from '@shared/components/ui/control-error/control-error';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '@shared/modules';
import { CustomValidators } from '@shared/utils/custom-validators';
import { FormField } from '@shared/components/ui/form-field/form-field';
import { RoutePath } from '@core/constants';
import { Auth } from '@shared/layouts/auth/auth';
import { AuthService } from '@core/services';
import { ChangePasswordRequest } from '@core/models';
import { Router } from '@angular/router';
import { Hint } from '@shared/components/ui/hint/hint';

@Component({
  selector: 'app-must-change-password',
  imports: [
    Label,
    ControlError,
    TranslateModule,
    ReactiveFormsModule,
    SharedModule,
    FormField,
    Auth,
    Hint,
  ],
  templateUrl: './must-change-password.html',
  styleUrl: './must-change-password.scss',
})
export class MustChangePassword implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  public loading = signal(false);
  public mustChangePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [CustomValidators.password]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [CustomValidators.passwordMatch('newPassword', 'confirmPassword')],
    }
  );

  public ngOnInit(): void {}

  public onSubmit() {
    if (this.mustChangePasswordForm.invalid) {
      this.mustChangePasswordForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.authService
      .changePassword(this.mustChangePasswordForm.value as ChangePasswordRequest)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate([RoutePath.HOME]);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
