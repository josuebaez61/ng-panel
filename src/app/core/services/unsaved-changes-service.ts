import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { UnsavedChangesDialogData, UnsavedChangesOptions } from '@core/models';
import { TranslateService } from '@ngx-translate/core';
import { UnsavedChangesDialog } from '@shared/dialogs/unsaved-changes-dialog/unsaved-changes-dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesService {
  private readonly translateService = inject(TranslateService);
  private readonly dialogService = inject(DialogService);

  private readonly _unsavedChanges = signal<boolean>(false);
  public readonly unsavedChanges = this._unsavedChanges.asReadonly();

  private readonly document = inject(DOCUMENT);

  // private dialogRef: DynamicDialogRef<UnsavedChangesDialog> | null = null;

  /**
   * Marks that there are unsaved changes
   */
  public markAsUnsaved() {
    this._unsavedChanges.set(true);
  }

  /**
   * Shakes the unsaved changes dialog
   */
  public shakeDialog() {
    const toast = this.document.querySelector('.unsaved-changes-dialog');
    if (toast) {
      toast.classList.add('animate__animated', 'animate__shakeX');
      setTimeout(() => {
        toast.classList.remove('animate__animated', 'animate__shakeX');
      }, 1000);
    }
  }

  /**
   * Resets the unsaved changes
   */
  public resetUnsavedChanges() {
    this._unsavedChanges.set(false);
  }
}
