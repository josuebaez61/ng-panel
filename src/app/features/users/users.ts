import { Component, computed, inject } from '@angular/core';
import { ListUser, PermissionName, User } from '@core/models';
import { AuthService, DialogService, PaginatedResourceLoader, UserService } from '@core/services';
import { PanelPageHeader } from '@shared/components/panel-page-header/panel-page-header';
import { UsersTable } from '@shared/components/table/users-table/users-table';
import { getPageFromLazyLoadEvent } from '@shared/utils/table';
import { TableLazyLoadEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-users',
  imports: [PanelPageHeader, UsersTable, ButtonModule],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  private readonly dialogService = inject(DialogService);

  public currentUser = this.authService.currentUser;

  public enableEditRoles = computed(
    () => !!this.currentUser()?.hasPermission(PermissionName.ManageUserRoles)
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
}
