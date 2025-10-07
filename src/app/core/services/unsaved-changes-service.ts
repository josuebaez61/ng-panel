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

  private dialogRef: DynamicDialogRef<UnsavedChangesDialog> | null = null;

  /**
   * Marks that there are unsaved changes
   */
  public markAsUnsaved() {
    this._unsavedChanges.set(true);
  }

  /**
   * Shows the unsaved changes dialog
   * @param saveCallback
   * @param discardCallback
   */
  public showUnsavedChangesMessage(opts: UnsavedChangesOptions = {}) {
    const { saveCallback, discardCallback, saveButtonText, title, message, discardButtonText } =
      opts;
    this._unsavedChanges.set(true);
    if (!this.dialogRef) {
      this.dialogRef = this.dialogService.open<UnsavedChangesDialog, UnsavedChangesDialogData>(
        UnsavedChangesDialog,
        {
          styleClass: 'unsaved-changes-dialog',
          position: 'bottom',
          closable: false,
          header: this.translateService.instant(title || 'unsavedChanges.title'),
          width: '400px',
          data: {
            saveButtonText,
            discardButtonText,
            message,
            title,
          },
        }
      );
      this.dialogRef?.onClose.subscribe({
        next: (result) => {
          if (result['shouldSaveChanges']) {
            saveCallback?.();
          } else {
            discardCallback?.();
            this.resetUnsavedChanges();
          }
          this.dialogRef = null;
        },
      });
    }
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

  /**
   * Gets the unsaved changes
   * @returns The unsaved changes
   */
  public getUnsavedChanges() {
    return this._unsavedChanges();
  }
}
