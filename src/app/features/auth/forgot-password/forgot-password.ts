import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { CommonPrimeNgModule } from '@shared/modules';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { RoutePath } from '@core/constants';
import { AuthLayout } from '@core/services';
import { FormField } from '@shared/components/form-field/form-field';
import { Auth } from '@shared/layouts/auth/auth';

@Component({
  selector: 'app-forgot-password',
  imports: [
    Label,
    ControlError,
    CommonPrimeNgModule,
    ReactiveFormsModule,
    TranslateModule,
    FormField,
    Auth,
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly authLayout = inject(AuthLayout);

  public backRoute = RoutePath.LOGIN;

  public forgotPasswordForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  public isLoading = false;

  public ngOnInit(): void {
    this.authLayout.setBackRoute(RoutePath.LOGIN);
  }

  public ngOnDestroy(): void {
    this.authLayout.clearBackRoute();
  }

  public onSubmit() {
    this.router.navigate([RoutePath.RESET_PASSWORD]);
  }
}
