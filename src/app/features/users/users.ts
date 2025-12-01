import { Component, computed, inject } from '@angular/core';
import { ListUser, PermissionName, Person, User } from '@core/models';
import {
  AuthService,
  Confirm,
  DialogService,
  PaginatedResourceLoader,
  UserService,
} from '@core/services';
import { PanelPageHeader } from '@shared/components/panel-page-header/panel-page-header';
import { UsersTable } from '@shared/components/table/users-table/users-table';
import { getPageFromLazyLoadEvent } from '@shared/utils/table';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from '@shared/modules';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-users',
  imports: [PanelPageHeader, UsersTable, ButtonModule, SharedModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly translateService = inject(TranslateService);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);
  private readonly confirm = inject(Confirm);

  public currentUser = this.authService.currentUser;

  public enableEditRoles = computed(
    () => !!this.currentUser()?.hasPermission(PermissionName.ASSIGN_ROLE)
  );

  public paginatedUsers = new PaginatedResourceLoader<ListUser>({
    fetchData: (request) => this.userService.paginatedUsers(request),
  });

  public onLazyLoad(event: TableLazyLoadEvent): void {
    console.log(event);
    this.paginatedUsers.handleTableLazyLoadEvent(event);
  }

  public openUserForm(user?: User): void {
    this.dialogService.openUserFormDialog(user).onClose.subscribe({
      next: (result) => {
        if (result) {
          this.paginatedUsers.refresh();
        }
      },
    });
  }

  public openPersonForm(user: User, person?: Person): void {
    this.dialogService.openPersonFormDialog(user, person).onClose.subscribe({
      next: (result) => {
        if (result) {
          this.paginatedUsers.refresh();
        }
      },
    });
  }

  public deactivateUser(user: User): void {
    this.confirm.open({
      message: this.translateService.instant('users.form.deactivateUserConfirmation', {
        userName: user.username,
      }),
      accept: () => {
        this.userService.deactivateUser(user.id).subscribe({
          next: () => {
            this.paginatedUsers.refresh();
          },
        });
      },
    });
  }

  public activateUser(user: User): void {
    console.log(user);
    this.confirm.open({
      message: this.translateService.instant('users.form.activateUserConfirmation', {
        userName: user.username,
      }),
      accept: () => {
        this.userService.activateUser(user.id).subscribe({
          next: () => {
            this.paginatedUsers.refresh();
          },
        });
      },
    });
  }
}
