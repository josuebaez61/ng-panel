import {
  Directive,
  OnInit,
  OnDestroy,
  inject,
  ElementRef,
  Renderer2,
  OnChanges,
  SimpleChanges,
  input,
} from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appFormErrorMessage]',
  standalone: true,
})
export class FormErrorMessageDirective implements OnInit, OnDestroy, OnChanges {
  public appFormErrorMessage = input<ValidationErrors | null | undefined>();
  public customMessages = input<Record<string, string>>({});

  private translateService = inject(TranslateService);
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  private langChangeSubscription = Subscription.EMPTY;

  public ngOnInit(): void {
    this.updateErrorMessage();
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(() => {
      this.updateErrorMessage();
    });
  }

  public ngOnDestroy(): void {
    this.langChangeSubscription.unsubscribe();
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['appFormErrorMessage'] || changes['customMessages']) {
      this.updateErrorMessage();
    }
  }

  private updateErrorMessage(): void {
    // Check if there are errors to show
    const validationErrors = this.appFormErrorMessage();
    if (!validationErrors || Object.keys(validationErrors).length === 0) {
      this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', '');
      return;
    }

    const errors = validationErrors;
    const firstErrorKey = Object.keys(errors)[0];

    if (firstErrorKey) {
      const errorMessage = this.getErrorMessage(firstErrorKey, errors[firstErrorKey]);
      this.renderer.setProperty(this.elementRef.nativeElement, 'textContent', errorMessage);
    }
  }

  private getErrorMessage(errorKey: string, errorValue: any): string {
    // Check for custom message first
    if (this.customMessages()[errorKey]) {
      return this.customMessages()[errorKey];
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
