import { Component, ViewChild, inject, input, linkedSignal, signal } from '@angular/core';
import { Role, User } from '@core/models';
import { ChipModule } from 'primeng/chip';
import { Popover, PopoverModule } from 'primeng/popover';
import { RoleSelection } from '../role-selection/role-selection';
import { Confirm, RoleService, UserService } from '@core/services';
import { FormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-roles-chips',
  imports: [
    FormsModule,
    ChipModule,
    PopoverModule,
    RoleSelection,
    SkeletonModule,
    ConfirmPopupModule,
  ],
  templateUrl: './user-roles-chips.html',
  styles: ``,
})
export class UserRolesChips {
  private readonly roleService = inject(RoleService);
  private readonly userService = inject(UserService);
  public user = input<User | null>(null);
  public roles = input<Role[]>([]);

  public _roles = linkedSignal(() => this.roles());

  public assignableRoles = signal<Role[]>([]);
  public enableEditRoles = input<boolean>(false);
  public loading = signal<boolean>(false);

  @ViewChild(Popover)
  public popover!: Popover;

  public loadRoles(): void {
    const userId = this.user()?.id;
    if (!userId) return;
    this.loading.set(true);
    this.roleService.getAssignableRoles(userId).subscribe({
      next: (response) => {
        this.assignableRoles.set(response.data!);
      },
      complete: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  public toggleRoleSelection(event: Event): void {
    this.popover.show(event);
    this.loadRoles();
  }

  public onRoleSelectionChange(role: Role): void {
    this.popover.hide();
    const userId = this.user()?.id;
    if (!role.id || !userId) return;
    this.loading.set(true);
    this.userService.assignRole(userId, role.id).subscribe({
      next: () => {
        this._roles.update((roles) => [...roles, role]);
      },
      complete: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  public onRoleRemove(event: Event, role: Role): void {
    const userId = this.user()?.id;
    if (!userId) return;
    this.loading.set(true);
    this.roleService.unassignUserFromRole(role.id, userId).subscribe({
      next: () => {
        this._roles.update((roles) => roles.filter((r) => r.id !== role.id));
      },
      complete: () => {
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
