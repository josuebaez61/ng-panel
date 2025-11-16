import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { UnsavedChangesService } from '@core/services/unsaved-changes-service';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const unsavedChangesService = inject(UnsavedChangesService);
  if (unsavedChangesService.unsavedChanges()) {
    unsavedChangesService.shakeDialog();
  }
  return !unsavedChangesService.unsavedChanges();
};
