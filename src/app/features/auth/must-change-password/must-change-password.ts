import { Component, OnInit, inject, signal } from '@angular/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonPrimeNgModule } from '@shared/modules';
import { CustomValidators } from '@shared/utils/custom-validators';
import { FormField } from '@shared/components/form-field/form-field';
import { RoutePath } from '@core/constants';
import { Auth } from '@shared/layouts/auth/auth';
import { AuthService } from '@core/services';
import { ChangeFirstTimePasswordRequest } from '@core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-must-change-password',
  imports: [
    Label,
    ControlError,
    TranslateModule,
    ReactiveFormsModule,
    CommonPrimeNgModule,
    FormField,
    Auth,
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
      newPassword: new FormControl('', [Validators.required, CustomValidators.password]),
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
      .changeFirstTimePassword(this.mustChangePasswordForm.value as ChangeFirstTimePasswordRequest)
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate([RoutePath.DASHBOARD]);
        },
        error: () => {
          this.loading.set(false);
        },
      });
  }
}
