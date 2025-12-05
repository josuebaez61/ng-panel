import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormErrorMessageDirective } from '@shared/directives';

@Component({
  selector: 'app-control-error',
  imports: [FormErrorMessageDirective],
  template: ` <small class="error-text" [appFormErrorMessage]="control()?.errors"></small> `,
  styles: [
    `
      .error-text {
        font-size: 0.75rem;
        line-height: 1.25rem;
        color: var(--p-inputtext-invalid-border-color);
        display: block;
        transition: all 0.2s ease-in-out;
      }

      :host-context(html.color-scheme-dark) .error-text {
        color: rgb(248 113 113); /* red-400 for dark mode */
      }
    `,
  ],
})
export class ControlError {
  public control = input<AbstractControl | null | undefined>();
}
