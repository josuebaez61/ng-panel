import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ResourcePermissions, Role } from '@core/models';
import { PermissionsService, RoleService, UnsavedChangesService } from '@core/services';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, tap } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { PanelPageHeader } from '@shared/components/panel-page-header/panel-page-header';
import { RoutePath } from '@core/constants';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-role-permissions',
  imports: [CheckboxModule, TranslateModule, FormsModule, ButtonModule, PanelPageHeader, JsonPipe],
  templateUrl: './role-permissions.html',
  styleUrl: './role-permissions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolePermissions implements OnInit {
  private readonly roleService = inject(RoleService);
  private readonly permissionsService = inject(PermissionsService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly unsavedChangesService = inject(UnsavedChangesService);

  public resources = signal<ResourcePermissions[]>([]);
  public selectedPermissions = signal<string[]>([]);

  public roleId = this.activatedRoute.snapshot.params['id'];
  public loading = signal(false);
  public error = signal<unknown>(null);

  public backRoute = RoutePath.ROLES;
  public role = signal<Role | null>(null);

  // Keep initial/saved state for reset functionality
  private savedPermissions: string[] = [];

  public ngOnInit(): void {
    this.loadData();
  }

  public loadData() {
    this.loading.set(true);
    this.error.set(null);
    forkJoin([
      this.roleService.getRoleById(this.roleId),
      this.roleService.getRolePermissions(this.roleId),
      this.permissionsService.getAllResourcesPermissions(),
    ]).subscribe({
      next: ([role, permissions, resources]) => {
        this.role.set(role);
        const permissionIds = permissions.map((p) => p.id);
        this.resources.set(resources.filter((r) => r.permissions.length > 0));
        this.selectedPermissions.set([...permissionIds]);

        // Save initial state as "saved" state
        this.savedPermissions = [...permissionIds];
      },
      complete: () => {
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.error.set(error);
      },
    });
  }

  /**
   * Handles individual checkbox change
   */
  public onPermissionToggle(permissionId: string, checked: boolean) {
    const currentSelection = [...this.selectedPermissions()];

    if (checked) {
      // Add if not already selected
      if (!currentSelection.includes(permissionId)) {
        currentSelection.push(permissionId);
      }
    } else {
      // Remove if selected
      const index = currentSelection.indexOf(permissionId);
      if (index > -1) {
        currentSelection.splice(index, 1);
      }
    }

    // Update signal with new selection
    this.selectedPermissions.set(currentSelection);

    // Update unsaved changes state
    this.updateUnsavedChangesState();

    console.log('Selected permissions:', currentSelection);
  }

  /**
   * Gets the current array of selected permission IDs
   */
  public getSelectedPermissionIds(): string[] {
    return this.selectedPermissions();
  }

  /**
   * Checks if a specific permission is selected
   */
  public isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissions().includes(permissionId);
  }

  /**
   * Selects or deselects all permissions of a specific resource
   */
  public toggleResourcePermissions(resourcePermissions: ResourcePermissions, selectAll: boolean) {
    const currentSelection = [...this.selectedPermissions()];
    const resourcePermissionIds = resourcePermissions.permissions.map((p) => p.id);

    if (selectAll) {
      // Add all resource permissions that are not already selected
      resourcePermissionIds.forEach((id) => {
        if (!currentSelection.includes(id)) {
          currentSelection.push(id);
        }
      });
    } else {
      // Remove all resource permissions
      resourcePermissionIds.forEach((id) => {
        const index = currentSelection.indexOf(id);
        if (index > -1) {
          currentSelection.splice(index, 1);
        }
      });
    }

    this.selectedPermissions.set(currentSelection);

    // Update unsaved changes state
    this.updateUnsavedChangesState();
  }

  /**
   * Checks if all permissions of a resource are selected
   */
  public areAllResourcePermissionsSelected(resourcePermissions: ResourcePermissions): boolean {
    return resourcePermissions.permissions.every((p) => this.isPermissionSelected(p.id));
  }

  /**
   * Checks if any permission of a resource is selected
   */
  public isSomeResourcePermissionSelected(resourcePermissions: ResourcePermissions): boolean {
    return resourcePermissions.permissions.some((p) => this.isPermissionSelected(p.id));
  }

  /**
   * Saves the selected permissions
   */
  public savePermissions() {
    const selectedIds = this.getSelectedPermissionIds();
    return this.roleService.updateRolePermissions(this.roleId, selectedIds).pipe(
      tap(() => {
        this.savedPermissions = [...selectedIds];
        // Reset unsaved changes state after successful save
        this.unsavedChangesService.resetUnsavedChanges();
      })
    );
  }

  /**
   * Resets selected permissions to the last saved state
   */
  public resetPermissions() {
    // Restore selection to saved state
    this.selectedPermissions.set([...this.savedPermissions]);

    // Reset unsaved changes state
    this.unsavedChangesService.resetUnsavedChanges();
    return Promise.resolve(true);
  }

  /**
   * Checks if there are unsaved changes
   */
  public hasUnsavedChanges(): boolean {
    const current = this.getSelectedPermissionIds().sort();
    const saved = [...this.savedPermissions].sort();

    if (current.length !== saved.length) {
      return true;
    }

    return current.some((id, index) => id !== saved[index]);
  }

  /**
   * Updates the unsaved changes state in the service
   */
  private updateUnsavedChangesState() {
    const hasChanges = this.hasUnsavedChanges();

    if (hasChanges) {
      // Show the unsaved changes dialog immediately
      this.unsavedChangesService.showUnsavedChangesMessage({
        saveCallback: () => this.savePermissions(), // Save callback
        discardCallback: () => this.resetPermissions(), // Discard callback
      });
    } else {
      // Reset unsaved changes if no changes detected
      this.unsavedChangesService.resetUnsavedChanges();
    }
  }
}
