import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmailChangeRequest, EmailVerificationRequest } from '@core/models';
import { AuthService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { FormField } from '@shared/components/form-field/form-field';
import { Label } from '@shared/components/label/label';
import { CommonPrimeNgModule } from '@shared/modules';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ControlError } from '@shared/components/control-error/control-error';
import { mergeMap } from 'rxjs';

@Component({
  selector: 'app-change-email-dialog',
  imports: [
    FormField,
    Label,
    ReactiveFormsModule,
    TranslateModule,
    CommonPrimeNgModule,
    ControlError,
  ],
  templateUrl: './change-email-dialog.html',
  styles: ``,
})
export class ChangeEmailDialog {
  private readonly authService = inject(AuthService);
  private readonly dialogRef = inject(DynamicDialogRef<ChangeEmailDialog>);
  public step = signal<'request' | 'verify'>('request');
  public isLoading = signal(false);

  public requestForm = new FormGroup({
    newEmail: new FormControl('', [Validators.required, Validators.email]),
  });

  public verifyForm = new FormGroup({
    verificationCode: new FormControl('', [Validators.required]),
  });

  public onSubmit(): void {
    if (this.step() === 'request') {
      this.onRequest();
    } else {
      this.onVerify();
    }
  }

  public resetSteps(): void {
    this.step.set('request');
    this.requestForm.reset();
    this.verifyForm.reset();
  }

  public onRequest(): void {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.authService.requestEmailChange(this.requestForm.value as EmailChangeRequest).subscribe({
      next: () => {
        this.step.set('verify');
      },
      error: () => {
        this.requestForm.markAllAsTouched();
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  public onVerify(): void {
    if (this.verifyForm.invalid) {
      this.verifyForm.markAllAsTouched();
      return;
    }
    this.isLoading.set(true);
    this.authService
      .verifyEmailChange(this.verifyForm.value as EmailVerificationRequest)
      .pipe(mergeMap(() => this.authService.getCurrentUser()))
      .subscribe({
        next: () => {
          this.dialogRef.close(true);
        },
        error: () => {
          this.verifyForm.markAllAsTouched();
          this.isLoading.set(false);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  public onCancel(): void {
    this.dialogRef.close(false);
  }

  public onResend(): void {
    // if (this.form.invalid) {
    //   this.form.markAllAsTouched();
    //   return;
    // }
  }
}
