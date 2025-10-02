import { DOCUMENT, Injectable, inject, signal } from '@angular/core';
import { UnsavedChangesMessageData } from '@core/models';
import { UnsavedChangesMessage } from '@shared/components/unsaved-changes-message/unsaved-changes-message';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesService {
  private readonly messageService = inject(MessageService);

  private readonly _unsavedChanges = signal<boolean>(false);
  public readonly unsavedChanges = this._unsavedChanges.asReadonly();

  private readonly document = inject(DOCUMENT);

  private visible = signal<boolean>(false);

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
  public showUnsavedChangesMessage(opts: UnsavedChangesMessageData) {
    const { saveCallback, discardCallback } = opts;
    this._unsavedChanges.set(true);
    if (!this.visible()) {
      this.messageService.add({
        contentStyleClass: 'unsaved-changes-message',
        closable: false,
        key: UnsavedChangesMessage.KEY,
        sticky: true,
        severity: 'secondary',
        data: {
          saveCallback,
          discardCallback,
        },
      });
      this.visible.set(true);
    }
  }

  public hideUnsavedChangesMessage() {
    this.messageService.clear(UnsavedChangesMessage.KEY);
    this.visible.set(false);
  }

  public shakeDialog() {
    const toast = this.document.querySelector(
      `p-toast[key="${UnsavedChangesMessage.KEY}"]>p-toastitem>div`
    );
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
