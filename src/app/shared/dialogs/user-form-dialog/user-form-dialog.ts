import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateUserRequest, UserFormDialogData } from '@core/models';
import { UserService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { FormField } from '@shared/components/form-field/form-field';
import { Label } from '@shared/components/label/label';
import { CommonPrimeNgModule } from '@shared/modules';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ControlError } from '@shared/components/control-error/control-error';

@Component({
  selector: 'app-user-form-dialog',
  imports: [
    FormField,
    Label,
    CommonPrimeNgModule,
    TranslateModule,
    ReactiveFormsModule,
    ControlError,
  ],
  templateUrl: './user-form-dialog.html',
  styles: ``,
})
export class UserFormDialog {
  private readonly userService = inject(UserService);

  public submitting = signal(false);

  private readonly dialogRef = inject(DynamicDialogRef<UserFormDialog>);
  private readonly dialogConfig = inject(DynamicDialogConfig<UserFormDialogData>);

  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    userName: new FormControl('', [Validators.required]),
  });

  constructor() {
    if (this.dialogConfig.data) {
      this.form.patchValue(this.dialogConfig.data.user);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const editingUser = this.dialogConfig.data.user;

    if (editingUser) {
      this.userService.updateUser(editingUser.id, this.form.value).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.submitting.set(false);
        },
        error: () => {
          this.submitting.set(false);
        },
      });
    } else {
      this.userService.createUser(this.form.value as CreateUserRequest).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.submitting.set(false);
        },
        error: () => {
          this.submitting.set(false);
        },
      });
    }
  }
}
