import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response-models';
import { PhoneCodeDto } from '../models/geography-models';

@Injectable({
  providedIn: 'root',
})
export class GeographyService {
  private readonly baseUrl = API_CONFIG.BASE_URL;
  private readonly http = inject(HttpClient);

  /**
   * Get all phone codes with country information
   * @returns Observable with array of PhoneCodeDto
   */
  public getPhoneCodes(): Observable<PhoneCodeDto[]> {
    return this.http
      .get<ApiResponse<PhoneCodeDto[]>>(
        `${this.baseUrl}${API_CONFIG.ENDPOINTS.GEOGRAPHY.PHONE_CODES}`
      )
      .pipe(map((response) => response.data || []));
  }
}
