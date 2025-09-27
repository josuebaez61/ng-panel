import { Component, inject, OnInit } from '@angular/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonPrimeNgModule } from '@shared/modules';
import { CustomValidators } from '@shared/utils/custom-validators';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RoutePath } from '@core/constants';
import { FormField } from '@shared/components/form-field/form-field';
import { Hint } from '@shared/components/hint/hint';
import { Auth } from '@shared/layouts/auth/auth';

@Component({
  selector: 'app-reset-password',
  imports: [
    CommonPrimeNgModule,
    Label,
    ControlError,
    TranslateModule,
    ReactiveFormsModule,
    ToastModule,
    FormField,
    Hint,
    Auth,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  providers: [MessageService],
})
export class ResetPassword implements OnInit {
  public resetPasswordForm!: FormGroup;
  public isLoading = false;

  public readonly backRoute = RoutePath.FORGOT_PASSWORD;

  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  public ngOnInit() {
    this.resetPasswordForm = this.fb.group(
      {
        code: ['', [Validators.required]],
        password: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [CustomValidators.passwordMatch('password', 'confirmPassword')],
      }
    );
  }

  public onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.markFormGroupTouched();
      this.messageService.add({
        severity: 'error',
        summary: this.translate.instant('auth.common.error'),
        detail: this.translate.instant('auth.resetPassword.error'),
      });
      return;
    }

    this.isLoading = true;
    const formValue = this.resetPasswordForm.value;

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('auth.common.success'),
        detail: this.translate.instant('auth.resetPassword.success'),
      });
      console.log('Reset password form submitted with:', formValue);
    }, 2000);
  }

  private markFormGroupTouched() {
    Object.keys(this.resetPasswordForm.controls).forEach((key) => {
      const control = this.resetPasswordForm.get(key);
      control?.markAsTouched();
    });
  }
}
