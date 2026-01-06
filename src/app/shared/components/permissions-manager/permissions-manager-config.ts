import { Observable } from 'rxjs';
import { Permission, ResourcePermissions } from '@core/models';

/**
 * Configuration interface for PermissionsManager component
 */
export interface PermissionsManagerConfig<T> {
  /**
   * Entity ID (e.g., roleId, apiKeyId)
   */
  entityId: string;

  /**
   * Get entity by ID
   */
  getEntity: (id: string) => Observable<T>;

  /**
   * Get permissions for the entity
   */
  getPermissions: (id: string) => Observable<Permission[]>;

  /**
   * Get all resources with permissions grouped by resource
   * If not provided, will use the default PermissionsService
   */
  getResourcesPermissions?: () => Observable<ResourcePermissions[]>;

  /**
   * Update permissions for the entity
   */
  updatePermissions: (id: string, permissionIds: string[]) => Observable<T>;

  /**
   * Back route for navigation
   */
  backRoute: string;

  /**
   * Translation keys
   */
  translations: {
    title: string;
    description?: string;
    resourceKey: string; // e.g., 'roles.permissions.resources' or 'apiKeys.permissions.resources'
    permissionNameKey: string; // e.g., 'roles.permissions.names' or 'apiKeys.permissions.names'
  };
}

