import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ListUser, CreateUserRequest, UpdateUserRequest, User } from '../models/user-models';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response-models';
import { Role } from '../models/role-models';
import { ApiPaginationResponse, PaginationRequest } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = API_CONFIG.BASE_URL;
  private readonly http = inject(HttpClient);

  /**
   * Get all users with pagination and filtering
   */
  public getUsers(page = 1, pageSize = 10, filters?: any): Observable<any> {
    const params: any = {
      page: page.toString(),
      pageSize: pageSize.toString(),
      ...filters,
    };

    return this.http.get(`${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.LIST}`, { params });
  }

  /**
   * Fetch paginated users from the API
   */
  public paginatedUsers(request: PaginationRequest): Observable<ApiPaginationResponse<ListUser>> {
    const params: any = {
      page: request.page.toString(),
      limit: request.limit.toString(),
    };

    if (request.globalSearch) {
      params.globalSearch = request.globalSearch;
    }

    if (request.sortBy) {
      params.sortBy = request.sortBy;
      params.sortDirection = request.sortDirection;
    }

    return this.http.get<ApiPaginationResponse<ListUser>>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.USERS.PAGINATED}`,
      {
        params: {
          ...params,
          ...request.filters,
        },
      }
    );
  }

  /**
   * Update user roles by user ID
   */
  public updateUserRoles(id: string, roleIds: string[]): Observable<ApiResponse<Role[]>> {
    return this.http.put<ApiResponse<Role[]>>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.UPDATE_ROLES_BY_USER_ID(id)}`,
      { roleIds }
    );
  }

  /**
   * Get user by ID
   */
  public getUserById(id: string): Observable<User> {
    return this.http
      .get<ApiResponse<User>>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.GET_BY_ID}/${id}`)
      .pipe(map((response) => response.data!));
  }

  /**
   * Get user roles by user ID
   */
  public getUserRoles(id: string): Observable<ApiResponse<Role[]>> {
    return this.http.get<ApiResponse<Role[]>>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.GET_ROLES_BY_USER_ID(id)}`
    );
  }

  /**
   * Create new user
   */
  public createUser(userData: CreateUserRequest): Observable<ListUser> {
    return this.http.post<ListUser>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.CREATE}`,
      userData
    );
  }

  /**
   * Update user
   */
  public updateUser(id: string, userData: UpdateUserRequest): Observable<ListUser> {
    return this.http.put<ListUser>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${id}`,
      userData
    );
  }

  /**
   * Delete user
   */
  public deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.DELETE}/${id}`);
  }

  /**
   * Toggle user active status
   */
  public toggleUserStatus(id: string, isActive: boolean): Observable<ListUser> {
    return this.http.patch<ListUser>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${id}/status`,
      { isActive }
    );
  }

  /**
   * Assign roles to user
   */
  public assignRoles(userId: string, roleIds: string[]): Observable<ListUser> {
    return this.http.post<ListUser>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.UPDATE_ROLES_BY_USER_ID(userId)}`,
      { roleIds }
    );
  }

  /**
   * Assign role to user
   */
  public assignRole(userId: string, roleId: string): Observable<ListUser> {
    return this.http.patch<ListUser>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.ASSIGN_ROLE_BY_USER_ID(userId)}`,
      { roleId }
    );
  }

  /**
   * Remove roles from user
   */
  public removeRoles(userId: string, roleIds: string[]): Observable<ListUser> {
    return this.http.delete<ListUser>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.UPDATE}/${userId}/roles`,
      { body: { roleIds } }
    );
  }

  /**
   * Activate user
   */
  public activateUser(id: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.ACTIVATE(id)}`,
      {}
    );
  }

  /**
   * Deactivate user
   */
  public deactivateUser(id: string): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(
      `${this.baseUrl}${API_CONFIG.ENDPOINTS.USERS.DEACTIVATE(id)}`,
      {}
    );
  }
}
