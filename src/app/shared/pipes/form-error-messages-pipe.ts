import { Pipe, PipeTransform, inject } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'formErrorMessage',
  standalone: true,
  pure: false, // Make it impure to react to language changes
})
export class FormErrorMessagePipe implements PipeTransform {
  private translateService = inject(TranslateService);

  public transform(
    validationErrors: ValidationErrors | null | undefined,
    customMessages?: Record<string, string>
  ): string {
    // Check if there are errors to show
    if (!validationErrors || Object.keys(validationErrors).length === 0) {
      return '';
    }

    const firstErrorKey = Object.keys(validationErrors)[0];

    if (!firstErrorKey) {
      return '';
    }

    return this.getErrorMessage(firstErrorKey, validationErrors[firstErrorKey], customMessages);
  }

  private getErrorMessage(
    errorKey: string,
    errorValue: any,
    customMessages?: Record<string, string>
  ): string {
    // Check for custom message first
    if (customMessages && customMessages[errorKey]) {
      return customMessages[errorKey];
    }

    // Map common validation errors to translation keys
    const translationKey = this.getTranslationKey(errorKey);

    // Get translation with parameters
    const params = this.getTranslationParams(errorKey, errorValue);

    return this.translateService.instant(translationKey, params);
  }

  private getTranslationKey(errorKey: string): string {
    const errorMap: Record<string, string> = {
      required: 'validation.required',
      email: 'validation.email',
      minlength: 'validation.minlength',
      maxlength: 'validation.maxlength',
      min: 'validation.min',
      max: 'validation.max',
      pattern: 'validation.pattern',
      passwordMatch: 'validation.passwordMatch',
      requiredUppercaseChar: 'validation.requiredUppercaseChar',
      requiredLowercaseChar: 'validation.requiredLowercaseChar',
      requiredNumberChar: 'validation.requiredNumberChar',
      requiredSpecialChar: 'validation.requiredSpecialChar',
      custom: 'validation.custom',
    };

    return errorMap[errorKey] || 'validation.generic';
  }

  private getTranslationParams(errorKey: string, errorValue: any): any {
    const params: any = {};

    switch (errorKey) {
      case 'minlength':
        params.requiredLength = errorValue.requiredLength;
        params.actualLength = errorValue.actualLength;
        break;
      case 'maxlength':
        params.requiredLength = errorValue.requiredLength;
        params.actualLength = errorValue.actualLength;
        break;
      case 'min':
        params.min = errorValue.min;
        params.actual = errorValue.actual;
        break;
      case 'max':
        params.max = errorValue.max;
        params.actual = errorValue.actual;
        break;
      case 'pattern':
        params.pattern = errorValue.requiredPattern;
        break;
    }

    return params;
  }
}
