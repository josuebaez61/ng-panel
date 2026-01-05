import { Directive, Input, TemplateRef, ViewContainerRef, OnDestroy, inject } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appIfControlError]',
  standalone: true,
})
export class IfControlErrorDirective implements OnDestroy {
  private templateRef = inject(TemplateRef<unknown>);
  private viewContainer = inject(ViewContainerRef);

  private control: AbstractControl | null = null;
  private eventsSubscription?: Subscription;
  private hasView = false;

  @Input()
  public set appIfControlError(control: AbstractControl | null) {
    // Unsubscribe from previous control if exists
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }

    this.control = control;

    if (control) {
      // Subscribe to control events to detect touch events
      this.eventsSubscription = control.events.subscribe(() => {
        this.updateView();
      });

      // Initial check
      this.updateView();
    } else {
      // Clear view if control is null
      this.clearView();
    }
  }

  public ngOnDestroy(): void {
    if (this.eventsSubscription) {
      this.eventsSubscription.unsubscribe();
    }
  }

  private updateView(): void {
    if (!this.control) {
      this.clearView();
      return;
    }

    const shouldShow = this.control.invalid && this.control.touched;

    if (shouldShow) {
      if (!this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      }
    } else {
      this.clearView();
    }
  }

  private clearView(): void {
    if (this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
