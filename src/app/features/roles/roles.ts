import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PermissionName, Role, RoleWithUsersCount } from '@core/models';
import { AuthService, DialogService, PaginatedResourceLoader, RoleService } from '@core/services';
import { PanelPageHeader } from '@shared/components/layout/panel-page-header/panel-page-header';
import { RolesTable } from '@shared/components/lists/table/roles-table/roles-table';
import { forkJoin } from 'rxjs';
import { SharedModule } from '@shared/modules';
import { RoutePath } from '@core/constants';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-roles',
  imports: [PanelPageHeader, RolesTable, SharedModule, RouterLink],
  templateUrl: './roles.html',
  styleUrl: './roles.scss',
})
export class Roles implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly roleService = inject(RoleService);
  private readonly dialogService = inject(DialogService);
  public roles = signal<RoleWithUsersCount[]>([]);
  public loading = signal<boolean>(false);
  public roleUsersPath = RoutePath.ROLES_USERS;
  public rolePermissionsPath = RoutePath.ROLES_PERMISSIONS;

  public canCreateRoles = computed(
    () => !!this.authService.currentUser()?.hasPermission(PermissionName.CREATE_ROLE)
  );

  public canUpdateRoles = computed(
    () => !!this.authService.currentUser()?.hasPermission(PermissionName.UPDATE_ROLE)
  );

  public canAssignPermissions = computed(
    () => !!this.authService.currentUser()?.hasPermission(PermissionName.ASSIGN_PERMISSION)
  );

  public canAssignRoles = computed(
    () => !!this.authService.currentUser()?.hasPermission(PermissionName.ASSIGN_ROLE)
  );

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.loading.set(true);
    forkJoin([this.roleService.getAllRoles(), this.roleService.getRoleUserCount()]).subscribe({
      next: ([roles, roleUsersCounts]) => {
        this.roles.set(
          roles.map((role) => ({ ...role, usersCount: roleUsersCounts[role.id] || 0 }))
        );
      },
      error: () => {
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }

  public openRoleForm(role?: RoleWithUsersCount) {
    this.dialogService.openRoleFormDialog(role)?.onClose.subscribe((res) => {
      if (res) {
        this.loadData();
      }
    });
  }
}
