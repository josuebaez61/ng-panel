import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_CONFIG } from '@core/config/api.config';
import { environment } from '../../../environments/environment';
import { map, Observable } from 'rxjs';
import { ApiResponse } from '../models/api-response-models';
import {
  Company,
  CompanySettings,
  UpdateCompanyRequest,
  UpdateCompanySettingsRequest,
} from '@core/models/company-models';

@Injectable({
  providedIn: 'root',
})
export class CompanyService {
  public readonly companyId = environment.companyId;
  private baseUrl = API_CONFIG.BASE_URL;
  private http = inject(HttpClient);

  public getCompany(): Observable<Company> {
    return this.http
      .get<ApiResponse<Company>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.COMPANIES.GET_BY_ID(this.companyId)}`
      )
      .pipe(map((response) => response.data!));
  }

  public updateCompany(company: UpdateCompanyRequest): Observable<Company> {
    return this.http
      .patch<ApiResponse<Company>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.COMPANIES.UPDATE(this.companyId)}`,
        company
      )
      .pipe(map((response) => response.data!));
  }

  public getCompanySettings(): Observable<CompanySettings> {
    return this.http
      .get<ApiResponse<CompanySettings>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.COMPANIES.GET_SETTINGS(this.companyId)}`
      )
      .pipe(map((response) => response.data!));
  }

  public updateCompanySettings(
    settings: UpdateCompanySettingsRequest
  ): Observable<CompanySettings> {
    return this.http
      .put<ApiResponse<CompanySettings>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.COMPANIES.UPDATE_SETTINGS(this.companyId)}`,
        settings
      )
      .pipe(map((response) => response.data!));
  }
}
