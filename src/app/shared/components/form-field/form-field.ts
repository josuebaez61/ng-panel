import { Component, ContentChild, Input } from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Label } from '../label/label';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField {
  @ContentChild(NgControl)
  public control?: NgControl;

  @ContentChild(Label)
  public label?: Label;

  @Input()
  public fixedHeight: boolean = true;

  @Input()
  public minHeight: string = 'auto';

  public get showHint(): boolean {
    return (
      (!this.control?.control?.touched && !!this.control?.control?.pristine) ||
      !!this.control?.control?.valid ||
      (!!this.control?.control?.touched && !this.control?.control?.dirty)
    );
  }

  public get isRequired(): boolean {
    return !!this.control?.control?.hasValidator(Validators.required);
  }
}
