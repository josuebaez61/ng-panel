import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '@shared/components/form-field/form-field';
import { Label } from '@shared/components/label/label';
import { CommonPrimeNgModule } from '@shared/modules';
import { ControlError } from '@shared/components/control-error/control-error';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-role-form-dialog',
  imports: [FormField, Label, CommonPrimeNgModule, ReactiveFormsModule, ControlError],
  templateUrl: './role-form-dialog.html',
  styles: ``,
})
export class RoleFormDialog {
  public readonly form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
  });

  public dialogRef = inject(DynamicDialogRef<RoleFormDialog>);

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.markAllAsDirty();
      return;
    }
  }
}
