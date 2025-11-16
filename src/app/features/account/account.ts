import { Component, computed, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { FormField } from '@shared/components/form-field/form-field';
import { CommonPrimeNgModule } from '@shared/modules';
import { Label } from '@shared/components/label/label';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, DialogService, UnsavedChangesService } from '@core/services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUser } from '@core/models';
import { ControlError } from '@shared/components/control-error/control-error';

@Component({
  selector: 'app-account',
  imports: [
    Card,
    UserAvatar,
    FormField,
    CommonPrimeNgModule,
    Label,
    TranslateModule,
    ReactiveFormsModule,
    ControlError,
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
    this.patchFormWithUserData();
    this.subscribeToFormChange();
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

  public patchFormWithUserData(): void {
    this.form.patchValue({
      firstName: this.user()?.firstName,
      lastName: this.user()?.lastName,
      userName: this.user()?.userName,
    });
  }

  public subscribeToFormChange(): void {
    this.form.valueChanges.subscribe({
      next: () => {
        this.unsavedChangesService.showUnsavedChangesMessage({
          discardCallback: () => {
            this.patchFormWithUserData();
          },
          saveCallback: () => {
            this.onSubmit();
          },
        });
      },
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
    } else {
      this.authService.updateCurrentUserData(this.form.getRawValue() as AuthUser).subscribe();
    }
  }
}
