import { Injectable, inject } from '@angular/core';
import { ConfirmDialogData } from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { Confirmation, ConfirmationService, MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class Confirm {
  private readonly confirmationService = inject(ConfirmationService);
  private readonly translateService = inject(TranslateService);
  private readonly defaultOptions: Confirmation = {
    message: this.translateService.instant('common.confirmMessage'),
    closable: false,
    icon: 'pi pi-exclamation-triangle',
    rejectButtonProps: {
      label: this.translateService.instant('common.cancel'),
      severity: 'secondary',
      outlined: true,
    },
    acceptButtonProps: {
      label: this.translateService.instant('common.confirm'),
    },
  };

  open(options: Confirmation = {}): void {
    this.confirmationService.confirm({
      ...this.defaultOptions,
      ...options,
    });
  }

  openPopup(event: Event, options: Confirmation = {}) {
    this.confirmationService.confirm({
      target: event.currentTarget as EventTarget,
      ...this.defaultOptions,
      ...options,
    });
  }
}
