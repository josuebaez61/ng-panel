import { Component, computed, inject, input, OnInit, signal, ViewChild } from '@angular/core';
import { AuthUser } from '@core/models';
import { AuthService, UserService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { PersonForm } from '@shared/components/templates/person-form/person-form';
import { UserAvatar } from '@shared/components/user/user-avatar/user-avatar';
import { ButtonModule } from 'primeng/button';
import { FormGroup } from '@angular/forms';
import { PanelModule } from 'primeng/panel';

@Component({
  selector: 'app-account-personal-info',
  standalone: true,
  imports: [UserAvatar, PersonForm, TranslateModule, ButtonModule, PanelModule],
  templateUrl: './account-personal-info.html',
  styleUrl: './account-personal-info.scss',
})
export class AccountPersonalInfo implements OnInit {
  // Input signal for the current user
  public user = input.required<AuthUser | null>();

  // Public userService for PersonForm
  public readonly userService = inject(UserService);

  // Saving state
  public saving = signal(false);

  @ViewChild(PersonForm)
  public personFormComponent!: PersonForm;

  public get personForm(): FormGroup | undefined {
    return this.personFormComponent?.form;
  }

  public get buttonDisabled(): boolean {
    return this.saving() || !!this.personForm?.pristine;
  }

  ngOnInit(): void {
    // Component initialization if needed
  }

  public onSave(event: { key: string; value: unknown }): void {
    if (!this.personForm || this.personForm.invalid) {
      this.personForm?.markAllAsTouched();
      return;
    }

    const currentUser = this.user();
    if (!currentUser?.id) {
      return;
    }

    this.saving.set(true);
    this.userService.updateCurrentUserPerson({ [event.key]: 1 }).subscribe({
      next: () => {
        this.saving.set(false);
        this.personForm?.markAsPristine();
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }

  public onReset(): void {
    const personData = this.user()?.person;
    if (personData) {
      this.personForm?.patchValue({
        firstName: personData.firstName || '',
        lastName: personData.lastName || '',
        identificationNumber: personData.identificationNumber || '',
        identificationType: personData.identificationType || '',
        phone: personData.phone || '',
      });
      this.personForm?.markAsPristine();
    }
  }
}
