import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'localizedDate',
  standalone: true,
  pure: false, // Make it impure to react to language changes
})
export class LocalizedDatePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  public transform(value: Date | string | number, format = 'medium'): string {
    if (!value) return '';

    // Get current language from translate service
    const currentLang = this.translateService.getCurrentLang() || 'en';

    // Create DatePipe with the correct locale
    const datePipe = new DatePipe(currentLang);

    // Convert value to Date if it's a string or number
    const dateValue =
      typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;

    return datePipe.transform(dateValue, format) || '';
  }
}
