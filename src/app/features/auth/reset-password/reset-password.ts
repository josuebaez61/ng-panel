import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SharedModule } from '@shared/modules';
import { CustomValidators } from '@shared/utils/custom-validators';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RoutePath } from '@core/constants';
import { FormField } from '@shared/components/form-field/form-field';
import { Hint } from '@shared/components/hint/hint';
import { Auth } from '@shared/layouts/auth/auth';
import { AuthService } from '@core/services';
import { Router } from '@angular/router';
import { NewPasswordForm } from '@shared/components/templates/new-password-form/new-password-form';

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
    NewPasswordForm,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  providers: [MessageService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPassword implements OnInit {
  public!: FormGroup;
  public isLoading = signal(false);

  @ViewChild(NewPasswordForm)
  public resetPasswordFormComponent!: NewPasswordForm;

  public codeForm = new FormGroup({
    code: new FormControl<string | null>(null, [Validators.required]),
  });
  public readonly backRoute = RoutePath.FORGOT_PASSWORD;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public ngOnInit() {}

  public onSubmit() {
    if (this.resetPasswordFormComponent.form.invalid || this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      this.resetPasswordFormComponent.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const payload = {
      code: this.codeForm.value.code || '',
      newPassword: this.resetPasswordFormComponent.form.value.newPassword || '',
    };
    this.authService.resetPassword(payload).subscribe({
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
