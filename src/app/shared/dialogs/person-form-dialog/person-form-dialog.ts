import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Person, PhoneCodeDto } from '@core/models';
import { GeographyService } from '@core/services';
import { SharedModule } from '@shared/modules';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

export interface PersonFormDialogData {
  person?: Person;
}

@Component({
  selector: 'app-person-form-dialog',
  imports: [SharedModule],
  templateUrl: './person-form-dialog.html',
  styleUrl: './person-form-dialog.scss',
})
export class PersonFormDialog {
  private readonly dialogRef = inject(DynamicDialogRef<PersonFormDialog>);
  private readonly dialogConfig = inject(DynamicDialogConfig<PersonFormDialogData>);
  public form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    identificationNumber: new FormControl('', [Validators.required]),
    identificationType: new FormControl('', [Validators.required]),
    phone: new FormControl(''),
  });
  private readonly geographyService = inject(GeographyService);
  public phoneCodes = signal<PhoneCodeDto[]>([]);
  public submitting = signal(false);

  constructor() {
    this.getPhoneCodes();
  }

  public getPhoneCodes(): void {
    this.geographyService.getPhoneCodes().subscribe({
      next: (response) => {
        this.phoneCodes.set(response);
        if (this.dialogConfig.data?.person) {
          console.log(this.dialogConfig.data.person);
          this.form.patchValue(this.dialogConfig.data.person);
        }
      },
    });
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
    this.dialogRef.close(this.form.value);
  }
}
