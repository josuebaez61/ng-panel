import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginatedResourceLoader, RoleService, UserService } from '@core/services';
import { CommonPrimeNgModule } from '@shared/modules';
import { FilterMatchMode } from 'primeng/api';
import { UsersTable } from '@shared/components/table/users-table/users-table';
import { PanelPageHeader } from '@shared/components/panel-page-header/panel-page-header';

@Component({
  selector: 'app-role-users',
  imports: [CommonPrimeNgModule, UsersTable, PanelPageHeader],
  templateUrl: './role-users.html',
  styleUrl: './role-users.scss',
})
export class RoleUsers implements OnInit {
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);
  private readonly route = inject(ActivatedRoute);

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

  public loadData() {}

  public openUsersSelectionDialog() {}
}
