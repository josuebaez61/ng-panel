import { environment } from '../../../environments/environment';

export const API_CONFIG = {
  BASE_URL: environment.apiUrl,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      REFRESH_TOKEN: '/auth/refresh-token',
      CHANGE_PASSWORD: '/auth/change-password',
      CHANGE_FIRST_TIME_PASSWORD: '/auth/change-first-time-password',
      ME: '/auth/me',
      REQUEST_EMAIL_CHANGE: '/auth/request-email-change',
      VERIFY_EMAIL_CHANGE: '/auth/verify-email-change',
      REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
      RESET_PASSWORD: '/auth/reset-password',
    },
    USERS: {
      LIST: '/users',
      PAGINATED: '/users/paginated',
      CREATE: '/users',
      UPDATE: '/users/id',
      DELETE: '/users',
      GET_BY_ID: '/users/id',
      ACTIVATE: (id: string): string => `/users/id/${id}/activate`,
      DEACTIVATE: (id: string): string => `/users/id/${id}/deactivate`,
      GET_ROLES_BY_USER_ID(id: string): string {
        return `/users/id/${id}/roles`;
      },
      UPDATE_ROLES_BY_USER_ID(id: string): string {
        return `/users/id/${id}/roles`;
      },
      ASSIGN_ROLE_BY_USER_ID: (id: string): string => {
        return `/users/id/${id}/roles`;
      },
    },
    PERMISSIONS: {
      BY_RESOURCE: '/permissions/by-resource',
    },
    ROLES: {
      ALL: '/roles/all',
      PAGINATED: '/roles/paginated',
      CREATE: '/roles',
      UPDATE: (id: string): string => `/roles/id/${id}`,
      ROLE_PERMISSION: (id: string): string => `/roles/id/${id}/permissions`,
      ASSIGN_USERS: (id: string): string => `/roles/id/${id}/assign-users`,
      UNASSIGN_USER: (id: string): string => `/roles/id/${id}/unassign-user`,
      DELETE: (id: string): string => `/roles/id/${id}`,
      GET_BY_ID: (id: string): string => `/roles/id/${id}`,
      USER_COUNTS: '/roles/user-counts',
      ASSIGNABLE_ROLES: (userId: string): string => `/roles/assignable/user/${userId}`,
      ASSIGNABLE_USERS: (roleId: string): string => `/roles/id/${roleId}/assignable-users`,
    },
  },
} as const;
