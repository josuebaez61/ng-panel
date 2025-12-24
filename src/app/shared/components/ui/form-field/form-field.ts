import {
  Component,
  ContentChild,
  Input,
  Output,
  EventEmitter,
  computed,
  signal,
  AfterViewInit,
  OnDestroy,
  input,
} from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Label } from '../label/label';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-form-field',
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    TranslateModule,
    TooltipModule,
  ],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField implements AfterViewInit, OnDestroy {
  @ContentChild(NgControl)
  public control?: NgControl;

  @ContentChild(Label)
  public label?: Label;

  @Input()
  public fixedHeight = true;

  @Input()
  public minHeight = 'auto';

  @Input()
  public hideRequiredMarker = false;

  @Input()
  public inlineEditable = false;

  @Output()
  public save = new EventEmitter<any>();

  @Output()
  public canceled = new EventEmitter<void>();

  public class = input<string>();

  // Signals for reactive state management
  private readonly _controlState = signal<any>(null);
  private controlStatusSubscription?: any;
  private controlValueSubscription?: any;

  // Signals for inline editing
  private readonly _isEditing = signal<boolean>(false);
  private readonly _originalValue = signal<any>(null);
  public readonly isEditing = computed(() => this._isEditing());
  public readonly hasChanges = computed(() => {
    if (!this.inlineEditable || !this.isEditing()) return false;
    const state = this._controlState();
    if (!state) return false;
    return state.dirty && state.value !== this._originalValue();
  });

  // Computed signals that depend on our reactive signal
  public readonly controlState = computed(() => this._controlState());

  public readonly isRequired = computed(() => {
    const state = this._controlState();
    return state ? state.hasValidator : false;
  });

  public readonly showHint = computed(() => {
    const state = this._controlState();
    if (!state) return false;

    // Show hint when:
    // 1. Field is pristine (never interacted with)
    // 2. Field is valid (regardless of interaction state)
    // Only hide hint when there's an error
    return state.pristine || state.valid;
  });

  public readonly showError = computed(() => {
    const state = this._controlState();
    if (!state) return false;

    // Show error when:
    // 1. Field is invalid and touched (user interacted and there's an error)
    // 2. Field is invalid and dirty (user made changes that resulted in error)
    return (state.invalid && state.touched) || (state.invalid && state.dirty);
  });

  public readonly hasError = computed(() => {
    const state = this._controlState();
    if (!state) return false;

    return state.invalid && (state.touched || state.dirty);
  });

  public ngAfterViewInit(): void {
    if (!this.control) {
      console.error(
        'FormField Error: No NgControl detected. Make sure your input/control is wrapped with ngModel, formControlName, or formControl directive.',
        this
      );
    }
    this.updateControlState();
    if (this.inlineEditable) {
      this.initializeInlineEditing();
    }
  }

  private initializeInlineEditing(): void {
    const control = this.control?.control;
    if (!control) return;

    // Set initial readonly state
    this.setReadonlyState(true);
    // Store original value
    this._originalValue.set(control.value);
  }

  private setReadonlyState(readonly: boolean): void {
    const control = this.control?.control;
    if (!control) return;

    // Disable/enable the control to prevent editing
    // Note: The input should also have [readonly]="!isEditing()" for better UX
    if (readonly) {
      control.disable({ emitEvent: false, onlySelf: true });
    } else {
      control.enable({ emitEvent: false, onlySelf: true });
    }
  }

  public onEditClick(): void {
    if (!this.inlineEditable) return;
    const control = this.control?.control;
    if (!control) return;

    this._originalValue.set(control.value);
    this._isEditing.set(true);
    this.setReadonlyState(false);
    // Mark as untouched to avoid showing errors immediately
    control.markAsUntouched();
  }

  public onSaveClick(): void {
    if (!this.inlineEditable) return;
    const control = this.control?.control;
    if (!control) return;

    if (control.invalid) {
      control.markAllAsTouched();
      return;
    }

    // Emit the save event with the current value
    this.save.emit(control.value);
    this.finishEditing();
  }

  public onCancelClick(): void {
    if (!this.inlineEditable) return;
    const control = this.control?.control;
    if (!control) return;

    // Revert to original value
    control.setValue(this._originalValue(), { emitEvent: false });
    control.markAsPristine();
    control.markAsUntouched();

    // Emit cancel event
    this.canceled.emit();
    this.finishEditing();
  }

  private finishEditing(): void {
    this._isEditing.set(false);
    this.setReadonlyState(true);
    const control = this.control?.control;
    if (control) {
      control.markAsPristine();
    }
  }

  public ngOnDestroy(): void {
    if (this.controlStatusSubscription) {
      this.controlStatusSubscription.unsubscribe();
    }
    if (this.controlValueSubscription) {
      this.controlValueSubscription.unsubscribe();
    }
  }

  private updateControlState(): void {
    // Use optional chaining and check if control exists and has the control property
    const control = this.control?.control;
    if (!control) {
      this._controlState.set(null);
      return;
    }

    // Check if control has required methods before accessing them
    if (typeof control.hasValidator !== 'function') {
      this._controlState.set(null);
      return;
    }

    try {
      // Initial state
      this._controlState.set({
        value: control.value,
        dirty: control.dirty,
        touched: control.touched,
        invalid: control.invalid,
        valid: control.valid,
        pending: control.pending,
        pristine: control.pristine,
        disabled: control.disabled,
        enabled: control.enabled,
        errors: control.errors,
        hasValidator: control.hasValidator(Validators.required),
      });

      // Helper method to update state
      const updateState = () => {
        if (!control || typeof control.hasValidator !== 'function') {
          return;
        }
        try {
          this._controlState.set({
            value: control.value,
            dirty: control.dirty,
            touched: control.touched,
            invalid: control.invalid,
            valid: control.valid,
            pending: control.pending,
            pristine: control.pristine,
            disabled: control.disabled,
            enabled: control.enabled,
            errors: control.errors,
            hasValidator: control.hasValidator(Validators.required),
          });
        } catch (error) {
          // Silently handle errors during state updates
          console.warn('Error updating control state:', error);
        }
      };

      // Only subscribe if events is available
      if (control.events && typeof control.events.subscribe === 'function') {
        control.events.subscribe(updateState);
      }

      // Subscribe to status changes (validation, touched, dirty, etc.)
      // this.controlStatusSubscription = control.statusChanges.subscribe(updateState);

      // Subscribe to value changes (user input)
      // this.controlValueSubscription = control.valueChanges.subscribe(updateState);
    } catch (error) {
      // If there's an error accessing control properties, set state to null
      console.warn('Error initializing control state:', error);
      this._controlState.set(null);
    }
  }
}
