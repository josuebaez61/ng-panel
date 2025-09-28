import { NgClass } from '@angular/common';
import { Component, input, forwardRef, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { Role } from '@core/models';
import { TranslateModule } from '@ngx-translate/core';
import { ListboxModule } from 'primeng/listbox';

@Component({
  selector: 'app-role-selection',
  imports: [ListboxModule, TranslateModule, FormsModule, NgClass],
  templateUrl: './role-selection.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RoleSelection),
      multi: true,
    },
  ],
})
export class RoleSelection implements ControlValueAccessor {
  public roles = input<Role[]>([]);
  public multiple = input<boolean>(false);
  public optionValue = input<string>();
  public class = input<string>('');

  // Internal state
  private _value = signal<any>(null);
  private _disabled = signal<boolean>(false);

  // ControlValueAccessor implementation
  private onChange = (value: any) => {};
  private onTouched = () => {};

  // Getters for template
  public get value() {
    return this._value();
  }

  public get disabled() {
    return this._disabled();
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this._value.set(value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  // Event handlers
  public onSelectionChange(value: any): void {
    this._value.set(value);
    this.onChange(value);
    this.onTouched();
  }

  // Utility methods
  public get selectedRoles(): Role[] {
    const value = this._value();
    if (!value) return [];
    return Array.isArray(value) ? value : [value];
  }

  public get hasSelection(): boolean {
    const value = this._value();
    if (!value) return false;
    return Array.isArray(value) ? value.length > 0 : true;
  }

  public clearSelection(): void {
    this.onSelectionChange(null);
  }
}
