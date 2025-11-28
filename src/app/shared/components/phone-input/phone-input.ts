import {
  Component,
  forwardRef,
  inject,
  OnInit,
  AfterViewInit,
  signal,
  computed,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { PHONE_CODES } from '@core/constants';

interface PhoneCodeOption {
  label: string;
  value: string;
  phoneCode: string;
  emoji: string;
  iso2: string;
  flagUrl: string;
  name: string;
  example: string;
}

@Component({
  selector: 'app-phone-input',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AutoCompleteModule,
    InputTextModule,
    RippleModule,
    TranslateModule,
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
export class PhoneInput implements ControlValueAccessor, OnInit, AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);

  @ViewChild('phoneInput', { static: false }) phoneInputRef?: ElementRef<HTMLInputElement>;

  // Internal state
  private _value = signal<string>('');
  private _disabled = signal<boolean>(false);
  private _selectedCountryCode = signal<PhoneCodeOption | null>(null);
  private _phoneNumber = signal<string>('');

  // Phone codes data
  public phoneCodes = signal<PhoneCodeOption[]>([]);
  public filteredPhoneCodes = signal<PhoneCodeOption[]>([]);

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

  // Computed placeholder based on selected country example
  public phonePlaceholder = computed(() => {
    const selectedCode = this._selectedCountryCode();
    if (!selectedCode || !selectedCode.example) {
      return '';
    }
    // Extract the number part from example (remove country code and formatting)
    // Example: "+54 11 1234 5678" -> "1112345678" (only digits)
    const example = selectedCode.example;
    const phoneCode = selectedCode.phoneCode;
    const numberPart = example.replace(phoneCode, '').trim();
    // Return only digits for placeholder
    return numberPart.replace(/\D/g, '');
  });

  ngOnInit(): void {
    this.loadPhoneCodes();
  }

  private loadPhoneCodes(): void {
    // Use constants instead of API call - instant load
    const options: PhoneCodeOption[] = PHONE_CODES.map((code) => ({
      label: `${code.phoneCode}`,
      value: code.phoneCode,
      phoneCode: code.phoneCode,
      emoji: code.emoji,
      iso2: code.iso2,
      flagUrl: `https://flagcdn.com/${code.iso2.toLowerCase()}.svg`,
      name: code.name,
      example: code.example,
    }));

    this.phoneCodes.set([...options]);
    this.filteredPhoneCodes.set([...options]);

    // If we have a value set before codes loaded, parse it now
    const currentValue = this._value();
    if (currentValue) {
      this.parsePhoneValue(currentValue);
    } else if (options.length > 0) {
      // Set default to first option if no value is set
      this._selectedCountryCode.set(options[0]);
    }
  }

  // Filter phone codes for autocomplete
  public filterPhoneCodes(event: { query: string }): void {
    const query = event.query?.trim() || '';
    const allCodes = this.phoneCodes();

    let filtered: PhoneCodeOption[];

    // If query is empty (dropdown button clicked or empty search), show all codes
    if (!query || query === '') {
      filtered = [...allCodes];
    } else {
      // Normalize query: remove + if present and convert to lowercase for comparison
      const normalizedQuery = query.replace(/^\+/, '').toLowerCase();
      const queryWithPlus = query.toLowerCase();

      // Filter codes based on query
      // Search in: phoneCode (with or without +), country name, and iso2
      filtered = allCodes.filter((code) => {
        // Search in phone code (with +, without +, or just numbers)
        const phoneCodeLower = code.phoneCode.toLowerCase();
        const phoneCodeWithoutPlus = code.phoneCode.replace(/^\+/, '').toLowerCase();

        // Search in label (phoneCode)
        const labelLower = code.label.toLowerCase();

        // Search in country name
        const nameLower = code.name.toLowerCase();

        // Search in iso2 code
        const iso2Lower = code.iso2.toLowerCase();

        return (
          phoneCodeLower.includes(queryWithPlus) ||
          phoneCodeWithoutPlus.includes(normalizedQuery) ||
          labelLower.includes(queryWithPlus) ||
          nameLower.includes(queryWithPlus) ||
          iso2Lower.includes(queryWithPlus)
        );
      });
    }

    this.filteredPhoneCodes.set(filtered);
    this.cdr.detectChanges();
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
      // Store only digits, no formatting
      this._phoneNumber.set(remainingNumber.replace(/\D/g, ''));
    } else {
      // If no code found, use default or first available
      if (codes.length > 0) {
        this._selectedCountryCode.set(codes[0]);
        // Store only digits, no formatting
        this._phoneNumber.set(cleanValue.replace(/\D/g, ''));
      }
    }
  }

  // Event handlers
  public onCountryCodeChange(code: PhoneCodeOption | null): void {
    this._selectedCountryCode.set(code);
    this.updateValue();
    this.onTouched();
    this.cdr.detectChanges();
  }

  public onPhoneNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Remove all non-digit characters (only allow numbers)
    const digits = value.replace(/\D/g, '');

    // Update the phone number signal with digits only (no formatting)
    this._phoneNumber.set(digits);

    // Update the input value if different (to remove any non-digit characters)
    if (digits !== value) {
      const cursorPosition = input.selectionStart || 0;
      const digitsBeforeCursor = value.substring(0, cursorPosition).replace(/\D/g, '').length;

      input.value = digits;

      // Restore cursor position
      Promise.resolve().then(() => {
        const newPosition = Math.min(digitsBeforeCursor, digits.length);
        input.setSelectionRange(newPosition, newPosition);
      });
    }

    this.updateValue();
    this.onTouched();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    // Ensure initial value is set if component is initialized with a value
    const currentValue = this._value();
    if (currentValue) {
      this.parsePhoneValue(currentValue);
    }
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
