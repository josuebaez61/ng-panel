import { Component, forwardRef, inject, OnInit, signal, computed } from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { GeographyService } from '@core/services';
import { PhoneCodeDto } from '@core/models';

interface PhoneCodeOption {
  label: string;
  value: string;
  phoneCode: string;
  emoji: string;
}

@Component({
  selector: 'app-phone-input',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    RippleModule,
  ],
  templateUrl: './phone-input.html',
  styleUrl: './phone-input.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneInput),
      multi: true,
    },
  ],
  standalone: true,
})
export class PhoneInput implements ControlValueAccessor, OnInit {
  private readonly geographyService = inject(GeographyService);

  // Internal state
  private _value = signal<string>('');
  private _disabled = signal<boolean>(false);
  private _selectedCountryCode = signal<PhoneCodeOption | null>(null);
  private _phoneNumber = signal<string>('');

  // Phone codes data
  public phoneCodes = signal<PhoneCodeOption[]>([]);
  public loading = signal<boolean>(false);

  // ControlValueAccessor implementation
  private onChange = (value: string) => {};
  private onTouched = () => {};

  // Computed values
  public get value(): string {
    return this._value();
  }

  public get disabled(): boolean {
    return this._disabled();
  }

  public get selectedCountryCode(): PhoneCodeOption | null {
    return this._selectedCountryCode();
  }

  public get phoneNumber(): string {
    return this._phoneNumber();
  }

  ngOnInit(): void {
    this.loadPhoneCodes();
  }

  private loadPhoneCodes(): void {
    54;
    this.loading.set(true);
    this.geographyService.getPhoneCodes().subscribe({
      next: (codes) => {
        const options: PhoneCodeOption[] = codes.map((code) => ({
          label: `${code.emoji} ${code.phoneCode}`,
          value: code.phoneCode,
          phoneCode: code.phoneCode,
          emoji: code.emoji,
        }));
        this.phoneCodes.set(options);

        // If we have a value set before codes loaded, parse it now
        const currentValue = this._value();
        if (currentValue) {
          this.parsePhoneValue(currentValue);
        } else if (options.length > 0) {
          // Set default to first option if no value is set
          this._selectedCountryCode.set(options[0]);
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    if (!value) {
      this._value.set('');
      this._phoneNumber.set('');
      return;
    }

    this._value.set(value);
    this.parsePhoneValue(value);
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this._disabled.set(isDisabled);
  }

  // Parse phone value to extract country code and number
  private parsePhoneValue(value: string): void {
    if (!value) {
      this._phoneNumber.set('');
      return;
    }

    // Remove all non-digit characters except +
    const cleanValue = value.replace(/[^\d+]/g, '').replace(/\+/g, '');

    // Try to find matching country code
    const codes = this.phoneCodes();
    if (codes.length === 0) {
      // If codes not loaded yet, store the value and parse later
      return;
    }

    let foundCode: PhoneCodeOption | null = null;
    let remainingNumber = cleanValue;

    // Sort codes by length (longest first) to match longer codes first
    const sortedCodes = [...codes].sort((a, b) => {
      const aDigits = a.phoneCode.replace(/[^\d]/g, '').length;
      const bDigits = b.phoneCode.replace(/[^\d]/g, '').length;
      return bDigits - aDigits;
    });

    for (const code of sortedCodes) {
      const codeDigits = code.phoneCode.replace(/[^\d]/g, '');
      if (cleanValue.startsWith(codeDigits)) {
        foundCode = code;
        remainingNumber = cleanValue.substring(codeDigits.length);
        break;
      }
    }

    if (foundCode) {
      this._selectedCountryCode.set(foundCode);
      this._phoneNumber.set(this.formatPhoneNumber(remainingNumber));
    } else {
      // If no code found, use default or first available
      if (codes.length > 0) {
        this._selectedCountryCode.set(codes[0]);
        this._phoneNumber.set(this.formatPhoneNumber(cleanValue));
      }
    }
  }

  // Format phone number with spaces
  private formatPhoneNumber(number: string): string {
    // Remove all non-digit characters
    const digits = number.replace(/\D/g, '');

    if (digits.length === 0) return '';

    // Format based on length (example: +54 11 5467 5590)
    // This is a general formatter, you might want to customize per country
    if (digits.length <= 2) {
      return digits;
    } else if (digits.length <= 4) {
      return `${digits.substring(0, 2)} ${digits.substring(2)}`;
    } else if (digits.length <= 8) {
      return `${digits.substring(0, 2)} ${digits.substring(2, 4)} ${digits.substring(4)}`;
    } else {
      return `${digits.substring(0, 2)} ${digits.substring(2, 4)} ${digits.substring(
        4,
        8
      )} ${digits.substring(8, 12)}`;
    }
  }

  // Event handlers
  public onCountryCodeChange(code: PhoneCodeOption | null): void {
    this._selectedCountryCode.set(code);
    this.updateValue();
    this.onTouched();
  }

  public onPhoneNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Format the number
    const formatted = this.formatPhoneNumber(digits);

    // Update the input value
    input.value = formatted;
    this._phoneNumber.set(formatted);

    this.updateValue();
    this.onTouched();
  }

  public onPhoneNumberKeyPress(event: KeyboardEvent): boolean {
    // Allow: backspace, delete, tab, escape, enter
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return true;
    }

    // Allow: Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
    if (
      (event.ctrlKey || event.metaKey) &&
      ['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())
    ) {
      return true;
    }

    // Only allow numbers (0-9)
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
      return false;
    }

    return true;
  }

  private updateValue(): void {
    const countryCode = this._selectedCountryCode();
    const phoneNumber = this._phoneNumber();

    if (!countryCode) {
      this._value.set('');
      this.onChange('');
      return;
    }

    // Combine country code and phone number
    const fullNumber = phoneNumber
      ? `${countryCode.phoneCode} ${phoneNumber}`
      : countryCode.phoneCode;
    this._value.set(fullNumber);
    this.onChange(fullNumber);
  }
}
