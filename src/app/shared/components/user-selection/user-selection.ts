import { NgClass } from '@angular/common';
import { Component, input, forwardRef, signal, output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { User } from '@core/models';
import { TranslateModule } from '@ngx-translate/core';
import { ListboxFilterEvent, ListboxModule } from 'primeng/listbox';
import { ScrollerLazyLoadEvent } from 'primeng/scroller';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-user-selection',
  imports: [ListboxModule, TranslateModule, FormsModule, NgClass, InfiniteScrollDirective],
  templateUrl: './user-selection.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UserSelection),
      multi: true,
    },
  ],
})
export class UserSelection implements ControlValueAccessor {
  public users = input<User[]>([]);
  public multiple = input<boolean>(false);
  public optionValue = input<string>();
  public class = input<string>('');

  public onScrollDown = output<void>();

  public filter = output<ListboxFilterEvent>();

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
  public get selectedUsers(): User[] {
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
