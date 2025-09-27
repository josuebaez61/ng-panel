import { inject, Injectable } from '@angular/core';
import { RoleDialogData, Role, UsersSelectionDialogData } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  public openRoleDialog(role?: Role) {}

  public openUsersSelectionDialog(data: UsersSelectionDialogData): void {}
}
