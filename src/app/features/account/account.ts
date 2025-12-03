import { Component, inject, signal, ViewChild } from '@angular/core';
import { Card } from 'primeng/card';
import { UserAvatar } from '@shared/components/user-avatar/user-avatar';
import { SharedModule } from '@shared/modules';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, Confirm, DialogService, UserService } from '@core/services';
import { AddressesList } from '@shared/components/addresses-list/addresses-list';
import { UserAddress } from '@core/models/address-model';
import { mergeMap, of, tap } from 'rxjs';
import { AccountInfo } from './components/account-info/account-info';
import { AccountPersonalInfo } from './components/account-personal-info/account-personal-info';

@Component({
  selector: 'app-account',
  imports: [Card, SharedModule, TranslateModule, AddressesList, AccountInfo, AccountPersonalInfo],
  templateUrl: './account.html',
  styleUrl: './account.scss',
})
export class Account {
  public readonly userService = inject(UserService);
  private readonly confirm = inject(Confirm);
  private readonly translateService = inject(TranslateService);
  public authService = inject(AuthService);
  public dialogService = inject(DialogService);
  public user = this.authService.currentUser;
  public addresses = signal<UserAddress[]>([]);
  public loadingAddresses = signal<boolean>(false);

  @ViewChild(AccountInfo)
  public accountInfoComponent!: AccountInfo;

  constructor() {
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

  public openAddressFormDialog(userAddress?: UserAddress) {
    this.dialogService
      .openAddressFormDialog(userAddress?.address)
      ?.onClose?.pipe(
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
}
