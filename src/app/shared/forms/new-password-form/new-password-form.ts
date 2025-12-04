import { Component, effect, input } from '@angular/core';
import { FormField } from '@shared/components/form-field/form-field';
import { Label } from '@shared/components/label/label';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@shared/modules';
import { Password } from 'primeng/password';
import { ControlError } from '@shared/components/control-error/control-error';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NewPasswordRequirements } from '@shared/components/new-password-requirements/new-password-requirements';
import { CustomValidators } from '@shared/utils/custom-validators';

@Component({
  selector: 'app-new-password-form',
  imports: [
    FormField,
    Label,
    TranslateModule,
    SharedModule,
    Password,
    NewPasswordRequirements,
    ControlError,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new-password-form.html',
  styles: ``,
})
export class NewPasswordForm {
  public form = new FormGroup<{
    currentPassword?: FormControl<string | null>;
    newPassword: FormControl<string | null>;
    confirmPassword: FormControl<string | null>;
  }>(
    {
      newPassword: new FormControl<string | null>('', [
        Validators.required,
        CustomValidators.password,
      ]),
      confirmPassword: new FormControl<string | null>('', [Validators.required]),
    },
    {
      validators: [CustomValidators.passwordMatch('newPassword', 'confirmPassword')],
    }
  );

  public requireCurrentPassword = input<boolean>(false);

  constructor() {
    effect(() => {
      if (this.requireCurrentPassword()) {
        this.form.addControl('currentPassword', new FormControl('', [Validators.required]));
      } else {
        this.form.removeControl('currentPassword');
      }
    });
  }
}
