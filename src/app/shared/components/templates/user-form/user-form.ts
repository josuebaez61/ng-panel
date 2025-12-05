import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '@shared/components/ui/form-field/form-field';
import { Label } from '@shared/components/ui/label/label';
import { ControlError } from '@shared/components/ui/control-error/control-error';
import { TranslateModule } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, FormField, Label, ControlError, TranslateModule, InputText],
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
}
