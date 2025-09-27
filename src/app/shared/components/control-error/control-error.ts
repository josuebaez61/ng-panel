import { Component, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormErrorMessageDirective } from '@shared/directives';

@Component({
  selector: 'app-control-error',
  imports: [FormErrorMessageDirective],
  template: `
    <small
      style="color: var(--p-inputtext-invalid-border-color)"
      [appFormErrorMessage]="control()?.errors"
    >
    </small>
  `,
  styles: ``,
})
export class ControlError {
  public control = input<AbstractControl | null | undefined>();
}
