import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { Person, User } from '@core/models';
import { UserService } from '@core/services';
import { PersonForm } from '@shared/components/person-form/person-form';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

export interface PersonFormDialogData {
  user?: User;
  person?: Person;
}

@Component({
  selector: 'app-person-form-dialog',
  imports: [PersonForm, TranslateModule, ButtonModule],
  templateUrl: './person-form-dialog.html',
  styleUrl: './person-form-dialog.scss',
})
export class PersonFormDialog {
  private readonly dialogRef = inject(DynamicDialogRef<PersonFormDialog>);
  private readonly dialogConfig = inject(DynamicDialogConfig<PersonFormDialogData>);
  public readonly userService = inject(UserService);

  @ViewChild(PersonForm, { static: false })
  public personFormComponent!: PersonForm;

  public submitting = signal(false);

  public person = computed(() => this.dialogConfig.data?.person || null);

  constructor() {
    console.log(this.person());
  }

  public closeDialog(): void {
    console.log('closeDialog');
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    const form = this.personFormComponent.form;
    console.log(form.value);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const editingUser = this.dialogConfig.data?.user;
    if (!editingUser) {
      this.submitting.set(false);
      return;
    }
    this.userService.updatePersonByUserId(editingUser.id, form.value as Person).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.submitting.set(false);
      },
      error: () => {
        this.submitting.set(false);
      },
    });
  }
}
