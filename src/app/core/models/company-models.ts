import { Currency } from '.';

export interface Company {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  email?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  logoUrl?: string;
  websiteUrl?: string;
  email?: string;
  phoneNumber?: string;
}

export interface CompanySettings {
  mainCurrencyId: string;
  themeColor?: string;
  mainCurrency?: Currency;
}

export interface UpdateCompanySettingsRequest {
  mainCurrencyId?: string;
  themeColor?: string;
  mainCurrency?: Currency;
}
