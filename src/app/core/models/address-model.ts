export interface UserAddress {
  id: string;
  address: Address;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  country: string;
  state: string;
  locality: string;
  postalCode: string;
  directions: string | null;
  createdAt: string;
  updatedAt: string;
}
