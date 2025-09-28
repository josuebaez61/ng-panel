import { Component, computed, inject } from '@angular/core';
import { ListUser, PermissionName } from '@core/models';
import { AuthService, PaginatedResourceLoader, UserService } from '@core/services';
import { PanelPageHeader } from '@shared/components/panel-page-header/panel-page-header';
import { UsersTable } from '@shared/components/table/users-table/users-table';
import { getPageFromLazyLoadEvent } from '@shared/utils/table';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-users',
  imports: [PanelPageHeader, UsersTable],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users {
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);
  public currentUser = this.authService.currentUser;

  public enableEditRoles = computed(
    () => !!this.currentUser()?.hasPermission(PermissionName.ManageUserRoles)
  );

  public paginatedUsers = new PaginatedResourceLoader<ListUser>({
    fetchData: (request) => this.userService.paginatedUsers(request),
  });

  public onLazyLoad(event: TableLazyLoadEvent): void {
    console.log(event);

    this.paginatedUsers.loadData(getPageFromLazyLoadEvent(event), event.rows!);
  }
}
