import { DOCUMENT, inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';

export const unsavedChangesGuard: CanDeactivateFn<unknown> = () => {
  const document = inject(DOCUMENT);
  const toast = document.querySelector('.unsaved-changes-dialog');
  if (toast) {
    toast.classList.add('animate__animated', 'animate__shakeX');
    setTimeout(() => {
      toast.classList.remove('animate__animated', 'animate__shakeX');
    }, 1000);
  }
  return !toast;
};
