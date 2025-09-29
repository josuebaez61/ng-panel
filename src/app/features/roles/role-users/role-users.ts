import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Confirm, PaginatedResourceLoader, RoleService, UserService } from '@core/services';
import { CommonPrimeNgModule } from '@shared/modules';
import { FilterMatchMode } from 'primeng/api';
import { UsersTable } from '@shared/components/table/users-table/users-table';
import { PanelPageHeader } from '@shared/components/panel-page-header/panel-page-header';
import { ListUser, Role } from '@core/models';
import { RoutePath } from '@core/constants';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-role-users',
  imports: [CommonPrimeNgModule, UsersTable, PanelPageHeader, ConfirmDialogModule],
  templateUrl: './role-users.html',
  styleUrl: './role-users.scss',
})
export class RoleUsers implements OnInit {
  private readonly confirm = inject(Confirm);
  private readonly translateService = inject(TranslateService);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly route = inject(ActivatedRoute);
  public role = signal<Role | null>(null);

  public backRoute = RoutePath.ROLES;

  public readonly paginatedResourceLoader = new PaginatedResourceLoader({
    fetchData: (request) => this.userService.paginatedUsers(request),
    defaultFilters: {
      roleId: this.route.snapshot.params['id'],
      roleIdFilterMatchMode: FilterMatchMode.CONTAINS,
    },
  });

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.roleService.getRoleById(this.route.snapshot.params['id']).subscribe({
      next: (role) => {
        this.role.set(role);
      },
    });
  }

  public openUsersSelectionDialog() {}

  public removeUserFromRole(user: ListUser) {
    this.confirm.open({
      message: this.translateService.instant('roles.userRoles.removeUserFromRoleConfirmation', {
        userName: `${user.firstName} ${user.lastName}`,
      }),
      accept: () => {
        this.roleService.unassignUserFromRole(this.route.snapshot.params['id'], user.id).subscribe({
          next: () => {
            this.paginatedResourceLoader.refresh();
          },
        });
      },
    });
  }
}
