import { Injectable, inject, signal } from '@angular/core';
import { UnsavedChangesDialogData } from '@core/models';
// import { UnsavedChangesDialog } from '@shared/dialogs/unsaved-changes-dialog/unsaved-changes-dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UnsavedChangesService {
  private readonly _unsavedChanges = signal<boolean>(false);
  // private readonly matDialog = inject(MatDialog);
  public readonly unsavedChanges = this._unsavedChanges.asReadonly();

  private dialogRef: any = null;

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
  public showUnsavedChangesDialog(
    saveCallback: () => Observable<any> | Promise<any>,
    discardCallback: () => Observable<any> | Promise<any>
  ) {
    this._unsavedChanges.set(true);
    if (!this.dialogRef) {
      // this.dialogRef = this.matDialog.open<UnsavedChangesDialog, UnsavedChangesDialogData>(
      //   UnsavedChangesDialog,
      //   {
      //     disableClose: true,
      //     width: '400px',
      //     hasBackdrop: false,
      //     position: { bottom: 'calc(var(--spacing) * 4)' },
      //     panelClass: 'unsaved-changes-dialog',
      //     id: 'unsaved-changes-dialog',
      //     data: {
      //       saveCallback,
      //       discardCallback,
      //     },
      //   }
      // );

      this.dialogRef.afterClosed().subscribe({
        next: () => {
          this.dialogRef = null;
        },
      });
    }
  }

  public shakeDialog() {
    if (this.dialogRef) {
      this.dialogRef.addPanelClass(['animate__animated', 'animate__shakeX']);
      setTimeout(() => {
        this.dialogRef?.removePanelClass(['animate__animated', 'animate__shakeX']);
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
