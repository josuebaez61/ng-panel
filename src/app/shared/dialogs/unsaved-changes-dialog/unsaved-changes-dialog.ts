import { Component, computed, inject } from '@angular/core';
import { UnsavedChangesDialogData } from '@core/models';
import { TranslateModule } from '@ngx-translate/core';
import { CommonPrimeNgModule } from '@shared/modules';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-unsaved-changes-dialog',
  imports: [TranslateModule, CommonPrimeNgModule],
  template: `
    <div class="flex flex-col flex-auto">
      <div class="font-medium text-md mb-4">
        {{ message() | translate }}
      </div>
      <div class="flex items-center justify-end gap-2">
        <p-button
          severity="contrast"
          size="small"
          [label]="discardButtonText() | translate"
          (click)="onDiscard()"
        />
        <p-button
          severity="contrast"
          size="small"
          [label]="saveButtonText() | translate"
          (click)="onSave()"
        />
      </div>
    </div>
  `,
  styles: ``,
})
export class UnsavedChangesDialog {
  private readonly dialogRef = inject(DynamicDialogRef<UnsavedChangesDialog>);
  private readonly dialogConfig = inject(DynamicDialogConfig<UnsavedChangesDialogData>);

  public message = computed(() => this.dialogConfig.data?.message || 'unsavedChanges.description');
  public title = computed(() => this.dialogConfig.data?.title || 'unsavedChanges.title');
  public saveButtonText = computed(
    () => this.dialogConfig.data?.saveButtonText || 'unsavedChanges.save'
  );
  public discardButtonText = computed(
    () => this.dialogConfig.data?.discardButtonText || 'unsavedChanges.discard'
  );

  public onSave(): void {
    this.dialogRef.close({ shouldSaveChanges: true });
  }

  public onDiscard(): void {
    this.dialogRef.close({ shouldSaveChanges: false });
  }
}
