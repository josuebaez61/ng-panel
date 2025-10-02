import { Component, inject } from '@angular/core';
import { UnsavedChangesService } from '@core/services';
import { TranslateModule } from '@ngx-translate/core';
import { Breakpoints } from '@shared/utils';
import { MessageService, ToastMessageOptions } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-unsaved-changes-toast',
  imports: [ToastModule, AvatarModule, ButtonModule, TranslateModule],
  template: `
    <p-toast
      position="bottom-center"
      key="unsaved-changes"
      (onClose)="onDiscard()"
      [baseZIndex]="5000"
      [breakpoints]="breakpoints"
    >
      <ng-template let-message #message>
        <div class="flex flex-col items-start flex-auto">
          <div class="flex items-center gap-2">
            <span class="font-bold">{{ 'unsavedChanges.title' | translate }}</span>
          </div>
          <div class="font-medium text-md my-4">
            {{ (message.summary ? message.summary : 'unsavedChanges.description') | translate }}
          </div>
          <div class="flex items-center justify-end gap-2">
            <p-button
              severity="contrast"
              size="small"
              [label]="'unsavedChanges.discard' | translate"
              (click)="onDiscard()"
            />
            <p-button
              severity="contrast"
              size="small"
              [label]="'unsavedChanges.save' | translate"
              (click)="onSave()"
            />
          </div>
        </div>
      </ng-template>
    </p-toast>
  `,
  styles: ``,
})
export class UnsavedChangesMessage {
  public static readonly KEY = 'unsaved-changes';

  private readonly unsavedChangesService = inject(UnsavedChangesService);
  private readonly messageService = inject(MessageService);
  private readonly breakpoint = Breakpoints.Small;

  public get breakpoints() {
    return { [`${this.breakpoint}px`]: { width: '90%' } };
  }

  public discardCallback = (): Observable<unknown> | Promise<unknown> => Promise.resolve();
  public saveCallback = (): Observable<unknown> | Promise<unknown> => Promise.resolve();

  constructor() {
    this.messageService.messageObserver.pipe(first()).subscribe({
      next: (message) => {
        if (this.isUnsavedChangesToastMessage(message)) {
          this.discardCallback = message.data.discardCallback;
          this.saveCallback = message.data.saveCallback;
        }
      },
    });
  }

  public onDiscard = () => {
    this.handleCallback(this.discardCallback);
  };
  public onSave = () => {
    this.handleCallback(this.saveCallback);
  };

  private handleCallback(callback: () => Observable<unknown> | Promise<unknown>) {
    const cbResult = callback();

    if (cbResult instanceof Observable) {
      cbResult.subscribe({
        error: () => {
          this.unsavedChangesService.hideUnsavedChangesMessage();
        },
        complete: () => {
          this.unsavedChangesService.hideUnsavedChangesMessage();
        },
      });
    }

    if (cbResult instanceof Promise) {
      cbResult.finally(() => {
        this.unsavedChangesService.hideUnsavedChangesMessage();
      });
    }
  }

  private isUnsavedChangesToastMessage(message: any): message is ToastMessageOptions {
    return (
      typeof message === 'object' && 'key' in message && message.key === UnsavedChangesMessage.KEY
    );
  }
}
