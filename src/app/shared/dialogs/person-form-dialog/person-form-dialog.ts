import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Person, PhoneCodeDto, User } from '@core/models';
import { GeographyService, UserService } from '@core/services';
import { SharedModule } from '@shared/modules';
import { PhoneInput } from '@shared/components/phone-input/phone-input';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface PersonFormDialogData {
  user?: User;
  person?: Person;
}

@Component({
  selector: 'app-person-form-dialog',
  imports: [SharedModule, PhoneInput, ReactiveFormsModule],
  templateUrl: './person-form-dialog.html',
  styleUrl: './person-form-dialog.scss',
})
export class PersonFormDialog {
  private readonly dialogRef = inject(DynamicDialogRef<PersonFormDialog>);
  private readonly dialogConfig = inject(DynamicDialogConfig<PersonFormDialogData>);
  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    lastName: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    identificationNumber: new FormControl('', [Validators.maxLength(50)]),
    identificationType: new FormControl('', []),
    phone: new FormControl('', [Validators.maxLength(20)]),
  });
  private readonly userService = inject(UserService);
  public phoneCodes = signal<PhoneCodeDto[]>([]);
  public submitting = signal(false);
  public identificationTypes = signal<string[]>([]);
  constructor() {
    this.userService.findAllIdentificationTypes().subscribe({
      next: (response) => {
        this.identificationTypes.set(response.data ?? []);
        this.patchForm();
      },
    });
  }

  public patchForm(): void {
    if (this.dialogConfig.data?.person) {
      this.form.patchValue(this.dialogConfig.data.person);
    }
  }

  public closeDialog(): void {
    this.dialogRef.close(false);
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    const editingUser = this.dialogConfig.data.user;
    this.userService.updatePersonByUserId(editingUser.id, this.form.value as Person).subscribe({
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
