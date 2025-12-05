import { AfterViewInit, Component, ViewChild, inject, signal } from '@angular/core';
import { CreateUserRequest, UserFormDialogData } from '@core/models';
import { UserService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserForm } from '@shared/components/templates/user-form/user-form';
import { DialogActions } from '@shared/directives';
import { ButtonModule } from 'primeng/button';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-form-dialog',
  imports: [UserForm, TranslateModule, ButtonModule, DialogActions],
  templateUrl: './user-form-dialog.html',
  styles: ``,
})
export class UserFormDialog implements AfterViewInit {
  private readonly userService = inject(UserService);

  public saving = signal(false);

  @ViewChild(UserForm)
  public userFormComponent?: UserForm;

  private readonly dialogRef = inject(DynamicDialogRef<UserFormDialog>);
  private readonly dialogConfig = inject(DynamicDialogConfig<UserFormDialogData>);

  public get form(): FormGroup | undefined {
    return this.userFormComponent?.form;
  }

  public ngAfterViewInit(): void {
    if (this.dialogConfig.data) {
      this.form?.patchValue(this.dialogConfig.data.user);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if (this.form?.invalid) {
      this.form?.markAllAsTouched();
      return;
    }
    this.saving.set(true);
    const editingUser = this.dialogConfig.data.user;

    if (editingUser) {
      this.userService.updateUser(editingUser.id, this.form?.value).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.saving.set(false);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    } else {
      this.userService.createUser(this.form?.value as CreateUserRequest).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.saving.set(false);
        },
        error: () => {
          this.saving.set(false);
        },
      });
    }
  }
}
