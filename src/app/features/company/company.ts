import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Company as CompanyModel, UpdateCompanyRequest } from '@core/models';
import { CompanyService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { FormFieldContainer } from '@shared/components/ui/form-field-container/form-field-container';
import { FormFieldError } from '@shared/components/ui/form-field-error/form-field-error';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { PanelPageHeader } from '@shared/components/layout/panel-page-header/panel-page-header';
import { PhoneInput } from '@shared/components/inputs/phone-input/phone-input';

@Component({
  selector: 'app-company',
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    FormFieldContainer,
    FormFieldError,
    PanelModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    PanelPageHeader,
    PhoneInput,
  ],
  templateUrl: './company.html',
  styleUrl: './company.scss',
})
export class Company implements OnInit {
  private readonly companyService = inject(CompanyService);

  public company = signal<CompanyModel | null>(null);
  public loading = signal(false);
  public saving = signal(false);

  public form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255),
    ]),
    description: new FormControl('', [Validators.maxLength(1000)]),
    logoUrl: new FormControl('', [Validators.maxLength(500)]),
    websiteUrl: new FormControl('', [Validators.maxLength(500)]),
    email: new FormControl('', [Validators.email, Validators.maxLength(255)]),
    phoneNumber: new FormControl('', [Validators.maxLength(20)]),
  });

  public ngOnInit(): void {
    this.loadCompany();
  }

  public loadCompany(): void {
    this.loading.set(true);
    this.companyService.getCompany().subscribe({
      next: (company) => {
        this.company.set(company);
        this.form.patchValue({
          name: company.name,
          description: company.description || '',
          logoUrl: company.logoUrl || '',
          websiteUrl: company.websiteUrl || '',
          email: company.email || '',
          phoneNumber: company.phoneNumber || '',
        });
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const updateData: UpdateCompanyRequest = {
      name: this.form.value.name || undefined,
      description: this.form.value.description || undefined,
      logoUrl: this.form.value.logoUrl || undefined,
      websiteUrl: this.form.value.websiteUrl || undefined,
      email: this.form.value.email || undefined,
      phoneNumber: this.form.value.phoneNumber || undefined,
    };

    this.companyService.updateCompany(updateData).subscribe({
      next: (company) => {
        this.company.set(company);
        this.saving.set(false);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  public onReset(): void {
    const company = this.company();
    if (company) {
      this.form.patchValue({
        name: company.name,
        description: company.description || '',
        logoUrl: company.logoUrl || '',
        websiteUrl: company.websiteUrl || '',
        email: company.email || '',
        phoneNumber: company.phoneNumber || '',
      });
      this.form.markAsUntouched();
    }
  }
}
