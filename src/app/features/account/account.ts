import { Component, inject, signal } from '@angular/core';
import { Card } from 'primeng/card';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { FormField } from '@shared/components/form-field/form-field';
import { SharedModule } from '@shared/modules';
import { Label } from '@shared/components/label/label';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AuthService,
  Confirm,
  DialogService,
  UnsavedChangesService,
  UserService,
} from '@core/services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthUser } from '@core/models';
import { ControlError } from '@shared/components/control-error/control-error';
import { UnsavedChangesDialog } from '@shared/dialogs/unsaved-changes-dialog/unsaved-changes-dialog';
import { AddressesList } from '@shared/components/addresses-list/addresses-list';
import { UserAddress } from '@core/models/address-model';
import { mergeMap, of, tap } from 'rxjs';

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
    AddressesList,
  ],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly userService = inject(UserService);
  private readonly confirm = inject(Confirm);
  private readonly translateService = inject(TranslateService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public user = this.authService.currentUser;
  public form = new FormGroup({
    username: new FormControl('', [Validators.required]),
  });
  public addresses = signal<UserAddress[]>([]);
  public loadingAddresses = signal<boolean>(false);
  public personForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
  });

  constructor() {
    this.patchForm();
    this.handleFormValueChanges();
    this.loadUserAddresses();
  }

  public loadUserAddresses(): void {
    this.loadingAddresses.set(true);
    this.userService.getCurrentUserAddresses().subscribe({
      next: (addresses) => {
        this.loadingAddresses.set(false);
        this.addresses.set(addresses);
      },
      error: () => {
        this.loadingAddresses.set(false);
      },
    });
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

  public openAddressFormDialog(userAddress?: UserAddress) {
    this.dialogService
      .openAddressFormDialog(userAddress?.address)
      .onClose.pipe(
        mergeMap((result) =>
          result
            ? userAddress
              ? this.userService
                  .updateCurrentUserAddress(userAddress.id, result)
                  .pipe(tap(() => this.loadUserAddresses()))
              : this.userService
                  .createCurrentUserAddress(result)
                  .pipe(tap(() => this.loadUserAddresses()))
            : of(null)
        )
      )
      .subscribe();
  }

  public patchForm = (): void => {
    this.form.patchValue({
      username: this.user()?.username,
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

  public deleteAddress(userAddress: UserAddress) {
    this.confirm.open({
      header: this.translateService.instant('addresses.deleteAddress'),
      message: this.translateService.instant('addresses.deleteAddressMessage'),
      accept: () => {
        this.userService.deleteCurrentUserAddress(userAddress.id).subscribe({
          next: () => {
            this.loadUserAddresses();
          },
        });
      },
      reject: () => {
        // Do nothing
      },
    });
  }

  public discard = () => {
    this.patchForm();
    this.unsavedChangesService.resetUnsavedChanges();
  };
}
