import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormField } from '@shared/components/ui/form-field/form-field';
import { Label } from '@shared/components/ui/label/label';
import { SharedModule } from '@shared/modules';
import { ControlError } from '@shared/components/ui/control-error/control-error';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RoleService } from '@core/services';
import { CreateRoleRequest, RoleFormDialogData, UpdateRoleRequest } from '@core/models';

@Component({
  selector: 'app-role-form-dialog',
  imports: [FormField, Label, SharedModule, ReactiveFormsModule, ControlError],
  templateUrl: './role-form-dialog.html',
  styles: ``,
})
export class RoleFormDialog {
  private readonly roleService = inject(RoleService);
  public readonly form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', []),
  });

  public dialogRef = inject(DynamicDialogRef<RoleFormDialog>);
  public dialogConfig = inject(DynamicDialogConfig<RoleFormDialogData>);

  constructor() {
    const role = this.dialogConfig.data?.role;
    if (role) {
      this.form.patchValue(role);
    }
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const role = this.dialogConfig.data?.role;
    if (role) {
      this.roleService.updateRole(role.id, this.form.value as UpdateRoleRequest).subscribe({
        next: (res) => {
          this.dialogRef.close(res);
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close();
          this.dialogRef.close(false);
        },
      });
    } else {
      this.roleService.createRole(this.form.value as CreateRoleRequest).subscribe({
        next: (res) => {
          this.dialogRef.close(res);
          this.dialogRef.close(true);
        },
        error: () => {
          this.dialogRef.close();
          this.dialogRef.close(false);
        },
      });
    }
  }
}
