import { Injectable, inject } from '@angular/core';
import { ConfirmDialogData } from '@core/models';

@Injectable({
  providedIn: 'root',
})
export class Confirm {
  public open(callback: () => void, message?: string): void {}
}
