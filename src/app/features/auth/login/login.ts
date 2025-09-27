import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ControlError } from '@shared/components/control-error/control-error';
import { Label } from '@shared/components/label/label';
import { CommonPrimeNgModule } from '@shared/modules';
import { RouterLink } from '@angular/router';
import { RoutePath } from '@core/constants';
import { FormField } from '@shared/components/form-field/form-field';
import { Auth } from '@shared/layouts/auth/auth';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    CommonPrimeNgModule,
    ReactiveFormsModule,
    TranslateModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CheckboxModule,
    ToastModule,
    ControlError,
    RouterLink,
    Label,
    FormField,
    Auth,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  providers: [MessageService],
})
export class Login implements OnInit {
  public loginForm!: FormGroup;
  public isLoading = signal(false);

  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly translate = inject(TranslateService);

  public passwordVisible = signal(false);

  public readonly forgotPasswordRoutePath = RoutePath.FORGOT_PASSWORD;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.loginForm.markAllAsDirty();
      return;
    }

    this.isLoading.set(true);
    const formValue = this.loginForm.value;

    // Simulate API call
    setTimeout(() => {
      this.isLoading.set(false);
      this.messageService.add({
        severity: 'success',
        summary: this.translate.instant('auth.common.success'),
        detail: this.translate.instant('auth.login.success'),
      });
      console.log('Form submitted with:', formValue);
    }, 2000);
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  loginWithGoogle() {
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('auth.login.google'),
      detail: this.translate.instant('auth.common.info'),
    });
  }

  loginWithMicrosoft() {
    this.messageService.add({
      severity: 'info',
      summary: this.translate.instant('auth.login.microsoft'),
      detail: this.translate.instant('auth.common.info'),
    });
  }
}
