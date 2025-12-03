import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedModule } from '@shared/modules';
import { CustomValidators } from '@shared/utils/custom-validators';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RoutePath } from '@core/constants';
import { FormField } from '@shared/components/form-field/form-field';
import { Hint } from '@shared/components/hint/hint';
import { Auth } from '@shared/layouts/auth/auth';
import { AuthService } from '@core/services';
import { ResetPasswordRequest } from '@core/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  imports: [
    SharedModule,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
  public resetPasswordForm!: FormGroup;
  public isLoading = signal(false);

  public readonly backRoute = RoutePath.FORGOT_PASSWORD;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public ngOnInit() {
    this.resetPasswordForm = this.fb.group(
      {
        code: ['', [Validators.required]],
        newPassword: ['', [CustomValidators.password]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: [CustomValidators.passwordMatch('newPassword', 'confirmPassword')],
      }
    );
  }

  public onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.resetPasswordForm.value;

    this.authService.resetPassword(formValue as ResetPasswordRequest).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate([RoutePath.LOGIN]);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
