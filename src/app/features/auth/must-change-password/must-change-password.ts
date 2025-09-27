import { Component, OnInit, inject, signal } from '@angular/core';
import { Label } from '@shared/components/label/label';
import { ControlError } from '@shared/components/control-error/control-error';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonPrimeNgModule } from '@shared/modules';
import { CustomValidators } from '@shared/utils/custom-validators';
import { FormField } from '@shared/components/form-field/form-field';

@Component({
  selector: 'app-must-change-password',
  imports: [
    Label,
    ControlError,
    TranslateModule,
    ReactiveFormsModule,
    CommonPrimeNgModule,
    FormField,
  ],
  templateUrl: './must-change-password.html',
  styleUrl: './must-change-password.scss',
})
export class MustChangePassword implements OnInit {
  public loading = signal(false);

  public mustChangePasswordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: [CustomValidators.passwordMatch('password', 'confirmPassword')],
    }
  );

  public ngOnInit(): void {}

  public onSubmit() {
    console.log('onSubmit');
  }
}
