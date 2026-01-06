export interface ApiKey {
  id: string;
  name: string;
  description?: string;
  key?: string; // Only available when creating
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
}

export interface UpdateApiKeyRequest {
  name?: string;
  description?: string;
  isActive?: boolean;
}
