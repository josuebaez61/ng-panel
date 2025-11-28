import { Component, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { FormField } from '@shared/components/form-field/form-field';
import { SharedModule } from '@shared/modules';
import { Label } from '@shared/components/label/label';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, DialogService, UnsavedChangesService } from '@core/services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUser } from '@core/models';
import { ControlError } from '@shared/components/control-error/control-error';
import { UnsavedChangesDialog } from '@shared/dialogs/unsaved-changes-dialog/unsaved-changes-dialog';

@Component({
  selector: 'app-account',
  imports: [
    Card,
    UserAvatar,
    FormField,
    SharedModule,
    Label,
    TranslateModule,
    ReactiveFormsModule,
    ControlError,
    UnsavedChangesDialog,
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public user = this.authService.currentUser;
  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    userName: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.patchForm();
    this.handleFormValueChanges();
  }

  public openChangePasswordDialog() {
    this.dialogService.openChangePasswordDialog().onClose.subscribe((result) => {
      console.log(result);
    });
  }

  public openChangeEmailDialog() {
    this.dialogService.openChangeEmailDialog().onClose.subscribe((result) => {
      console.log(result);
    });
  }

  public patchForm = (): void => {
    this.form.patchValue({
      firstName: this.user()?.person?.firstName,
      lastName: this.user()?.person?.lastName,
      userName: this.user()?.username,
    });
  };

  public handleFormValueChanges(): void {
    this.form.valueChanges.subscribe({
      next: () => {
        this.unsavedChangesService.markAsUnsaved();
      },
    });
  }

  public save = () => {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.authService
        .updateCurrentUserData(this.form.getRawValue() as unknown as AuthUser)
        .subscribe({
          next: () => {
            this.unsavedChangesService.resetUnsavedChanges();
          },
          error: () => {
            this.unsavedChangesService.markAsUnsaved();
          },
        });
    }
  };

  public discard = () => {
    this.patchForm();
    this.unsavedChangesService.resetUnsavedChanges();
  };
}
