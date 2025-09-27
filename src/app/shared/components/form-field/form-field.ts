import {
  Component,
  ContentChild,
  Input,
  computed,
  signal,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { NgControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Label } from '../label/label';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule],
  templateUrl: './form-field.html',
  styleUrl: './form-field.scss',
})
export class FormField implements AfterViewInit, OnDestroy {
  @ContentChild(NgControl)
  public control?: NgControl;

  @ContentChild(Label)
  public label?: Label;

  @Input()
  public fixedHeight: boolean = true;

  @Input()
  public minHeight: string = 'auto';

  @Input()
  public hideRequiredMarker: boolean = false;

  // Signals for reactive state management
  private readonly _controlState = signal<any>(null);
  private controlStatusSubscription?: any;
  private controlValueSubscription?: any;

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
    // 2. Field is valid and touched but not dirty (focused then blurred without changes)
    // 3. Field is valid and touched (user made changes but they're valid)
    return (
      state.pristine ||
      (state.valid && state.touched && !state.dirty) ||
      (state.valid && state.touched && state.dirty)
    );
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

  ngAfterViewInit(): void {
    this.updateControlState();
  }

  ngOnDestroy(): void {
    if (this.controlStatusSubscription) {
      this.controlStatusSubscription.unsubscribe();
    }
    if (this.controlValueSubscription) {
      this.controlValueSubscription.unsubscribe();
    }
  }

  private updateControlState(): void {
    const control = this.control?.control;
    if (!control) {
      this._controlState.set(null);
      return;
    }

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
    };

    // Subscribe to status changes (validation, touched, dirty, etc.)
    this.controlStatusSubscription = control.statusChanges.subscribe(updateState);

    // Subscribe to value changes (user input)
    this.controlValueSubscription = control.valueChanges.subscribe(updateState);
  }
}
