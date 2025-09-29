import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Role, CreateRoleRequest, UpdateRoleRequest } from '../models/role-models';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response-models';
import { Permission } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private baseUrl = API_CONFIG.BASE_URL;

  private http = inject(HttpClient);

  /**
   * Get all roles with pagination and filtering
   */
  public getAllRoles(): Observable<Role[]> {
    return this.http
      .get<ApiResponse<Role[]>>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.ALL}`)
      .pipe(map((response) => response.data || []));
  }

  /**
   * Get role user counts
   *
   * Example response:
   * ```json
   * {
   *   "roleId1": 10,
   *   "roleId2": 20,
   *   "roleId3": 30
   * }
   * ```
   */
  public getRoleUsersCounts(): Observable<Record<string, number>> {
    return this.http
      .get<ApiResponse<Record<string, number>>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.USER_COUNTS}`
      )
      .pipe(map((response) => response.data || {}));
  }

  /**
   * Get role by ID
   */
  public getRoleById(id: string): Observable<Role> {
    return this.http
      .get<ApiResponse<Role>>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.GET_BY_ID(id)}`)
      .pipe(map((response) => response.data!));
  }

  /**
   * Create new role
   */
  public createRole(roleData: CreateRoleRequest): Observable<Role> {
    return this.http
      .post<ApiResponse<Role>>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.CREATE}`, roleData)
      .pipe(map((response) => response.data!));
  }

  /**
   * Update role
   */
  public updateRole(id: string, roleData: UpdateRoleRequest): Observable<Role> {
    return this.http
      .patch<ApiResponse<Role>>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.UPDATE(id)}`, roleData)
      .pipe(map((response) => response.data!));
  }

  /**
   * Delete role
   */
  public deleteRole(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.DELETE(id)}`);
  }

  /**
   * Toggle role active status
   */
  public toggleRoleStatus(id: string, isActive: boolean): Observable<Role> {
    return this.http
      .patch<ApiResponse<Role>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.UPDATE}/${id}/status`,
        { isActive }
      )
      .pipe(map((response) => response.data!));
  }

  /**
   * Assign permissions to role
   */
  public assignPermissions(roleId: string, permissionIds: string[]): Observable<Role> {
    return this.http.post<Role>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.UPDATE}/${roleId}/permissions`,
      { permissionIds }
    );
  }

  /**
   * Remove permissions from role
   */
  public removePermissions(roleId: string, permissionIds: string[]): Observable<Role> {
    return this.http.delete<Role>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.UPDATE}/${roleId}/permissions`,
      { body: { permissionIds } }
    );
  }

  /**
   * Get permissions assigned to a role
   */
  public getRolePermissions(roleId: string): Observable<Permission[]> {
    return this.http
      .get<ApiResponse<Permission[]>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.ROLE_PERMISSION(roleId)}`
      )
      .pipe(map((response) => response.data!));
  }

  /**
   * Update role permissions
   * @param roleId The role ID
   * @param permissionIds Array of permission IDs to assign
   * @returns Observable with the updated role
   */
  public updateRolePermissions(roleId: string, permissionIds: string[]): Observable<Role> {
    return this.http.put<Role>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.ROLE_PERMISSION(roleId)}`,
      { permissionIds }
    );
  }

  /**
   * Assign users to role
   * @param roleId The role ID
   * @param userIds Array of user IDs to assign
   * @returns Observable with the updated role
   */
  public assignUsersToRole(roleId: string, userIds: string[]): Observable<Role> {
    return this.http.post<Role>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.ASSIGN_USERS(roleId)}`,
      { userIds }
    );
  }

  public unassignUserFromRole(roleId: string, userId: string): Observable<Role> {
    return this.http.post<Role>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.UNASSIGN_USER(roleId)}`,
      { userId }
    );
  }

  public getAssignableRoles(userId: string): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.ROLES.ASSIGNABLE_ROLES(userId)}`
    );
  }
}
