import { Component, inject, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { FormField } from '@shared/components/form-field/form-field';
import { Label } from '@shared/components/label/label';
import { SharedModule } from '@shared/modules';
import { Password } from 'primeng/password';
import { NewPasswordRequirements } from '@shared/components/new-password-requirements/new-password-requirements';
import {
  FormControl,
  FormGroup,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CustomValidators } from '@shared/utils';
import { ControlError } from '@shared/components/control-error/control-error';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AuthService } from '@core/services';
import { ChangePasswordRequest } from '@core/models';

@Component({
  selector: 'app-change-password-dialog',
  imports: [
    FormField,
    Label,
    TranslateModule,
    SharedModule,
    Password,
    NewPasswordRequirements,
    ControlError,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './change-password-dialog.html',
  styles: ``,
})
export class ChangePasswordDialog {
  private readonly dialogRef = inject(DynamicDialogRef<ChangePasswordDialog>);
  private readonly authService = inject(AuthService);
  public isLoading = signal(false);

  public form = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [CustomValidators.password]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [CustomValidators.passwordMatch('newPassword', 'confirmPassword')],
    }
  );

  public cancel = () => this.dialogRef.close();

  public onSave() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.authService.changePassword(this.form.value as ChangePasswordRequest).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: () => {
        this.dialogRef.close(false);
        this.isLoading.set(false);
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }
}
