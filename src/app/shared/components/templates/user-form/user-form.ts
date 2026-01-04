import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '@shared/components/ui/form-field-deprecated/form-field';
import { Label } from '@shared/components/ui/label/label';
import { ControlError } from '@shared/components/ui/control-error/control-error';
import { TranslateModule } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { FormErrorMessagePipe } from '@shared/pipes';
import { IfControlErrorDirective } from '@shared/directives';
import { FormFieldContainer } from '@shared/components/ui/form-field-container/form-field-container';
import { FormFieldError } from '@shared/components/ui/form-field-error/form-field-error';
import { FormFieldHint } from '@shared/components/ui/form-field-hint/form-field-hint';
import { Select } from 'primeng/select';

@Component({
  selector: 'app-user-form',
  imports: [
    ReactiveFormsModule,
    FormField,
    Label,
    FormFieldContainer,
    ControlError,
    FloatLabelModule,
    TranslateModule,
    InputText,
    MessageModule,
    FormErrorMessagePipe,
    IfControlErrorDirective,
    FormFieldError,
    FormFieldHint,
    Select,
  ],
  templateUrl: './user-form.html',
  styles: ``,
})
export class UserForm {
  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(200)]),
    username: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
  });

  constructor() {
    this.form.events.subscribe((event) => {
      console.log(event);
    });
  }
}
