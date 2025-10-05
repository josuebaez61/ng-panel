import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

/**
 * Custom validators for Angular Reactive Forms
 *
 * This class provides static methods for common validation scenarios
 * that are not covered by Angular's built-in validators.
 */
export class CustomValidators {
  /**
   * Validator that requires the date to be before or equal to the maximum date
   *
   * @param maxDate - The maximum allowed date (defaults to today)
   * @returns A validator function
   */
  public static maxDate(maxDate?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values (let required validator handle it)
      }

      const selectedDate = new Date(control.value);
      const max = maxDate || new Date();

      // Set max date to end of day for comparison
      max.setHours(23, 59, 59, 999);

      if (selectedDate > max) {
        return {
          maxDate: {
            max: max.toISOString().split('T')[0], // Format as YYYY-MM-DD
            actual: selectedDate.toISOString().split('T')[0],
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator that requires the password and confirm password fields to match
   *
   * @param passwordControlName - The name of the password control
   * @param confirmPasswordControlName - The name of the confirm password control
   * @returns A validator function
   */
  public static passwordMatch(
    passwordControlName: string,
    confirmPasswordControlName: string
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control) {
        return null;
      }
      const errorKey = 'passwordMatch';
      const password = control.get(passwordControlName);
      const confirmPassword = control.get(confirmPasswordControlName);

      if (!password || !confirmPassword) {
        return null;
      }

      if (password && confirmPassword && password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ ...(confirmPassword.errors || {}), [errorKey]: true });
        return {
          [errorKey]: true,
        };
      }

      const currentConfirmPasswordErrors = confirmPassword.errors;
      delete currentConfirmPasswordErrors?.[errorKey];
      const errorsCount = Object.keys(currentConfirmPasswordErrors || {}).length;
      confirmPassword.setErrors(errorsCount > 0 ? { ...currentConfirmPasswordErrors } : null);

      return null;
    };
  }

  /**
   * Validator that requires the date to be after or equal to the minimum date
   *
   * @param minDate - The minimum allowed date
   * @returns A validator function
   */
  public static minDate(minDate: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values (let required validator handle it)
      }

      const selectedDate = new Date(control.value);

      // Set min date to start of day for comparison
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);

      if (selectedDate < min) {
        return {
          minDate: {
            min: min.toISOString().split('T')[0], // Format as YYYY-MM-DD
            actual: selectedDate.toISOString().split('T')[0],
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator that requires the date to be within a specific range
   *
   * @param minDate - The minimum allowed date
   * @param maxDate - The maximum allowed date (defaults to today)
   * @returns A validator function
   */
  public static dateRange(minDate: Date, maxDate?: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const selectedDate = new Date(control.value);
      const min = new Date(minDate);
      const max = maxDate || new Date();

      // Set time boundaries
      min.setHours(0, 0, 0, 0);
      max.setHours(23, 59, 59, 999);

      if (selectedDate < min || selectedDate > max) {
        return {
          dateRange: {
            min: min.toISOString().split('T')[0],
            max: max.toISOString().split('T')[0],
            actual: selectedDate.toISOString().split('T')[0],
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator that requires the age to be at least a minimum value
   *
   * @param minAge - The minimum required age in years
   * @returns A validator function
   */
  public static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const birthDate = new Date(control.value);
      const today = new Date();

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < minAge) {
        return {
          minAge: {
            requiredAge: minAge,
            actualAge: age,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator that requires the age to be at most a maximum value
   *
   * @param maxAge - The maximum allowed age in years
   * @returns A validator function
   */
  public static maxAge(maxAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const birthDate = new Date(control.value);
      const today = new Date();

      // Calculate age
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age > maxAge) {
        return {
          maxAge: {
            requiredAge: maxAge,
            actualAge: age,
          },
        };
      }

      return null;
    };
  }

  /**
   * Validator for future dates only (opposite of maxDate with today)
   * Useful for scheduling, appointments, etc.
   *
   * @returns A validator function
   */
  public static futureDate(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Don't validate empty values
      }

      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today

      if (selectedDate <= today) {
        return {
          futureDate: {
            actual: selectedDate.toISOString().split('T')[0],
          },
        };
      }

      return null;
    };
  }

  public static requiredUppercaseChar(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^(?=.*[A-Z])/;

    if (!regex.test(control.value)) {
      return {
        requiredUppercaseChar: true,
      };
    }

    return null;
  }

  public static requiredLowercaseChar(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^(?=.*[a-z])/;

    if (!regex.test(control.value)) {
      return {
        requiredLowercaseChar: true,
      };
    }

    return null;
  }

  public static requiredNumberChar(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^(?=.*\d)/;

    if (!regex.test(control.value)) {
      return {
        requiredNumberChar: true,
      };
    }

    return null;
  }

  public static requiredSpecialChar(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const regex = /^(?=.*[@$!%*?&])/;

    if (!regex.test(control.value)) {
      return {
        requiredSpecialChar: true,
      };
    }

    return null;
  }

  public static password = Validators.compose([
    Validators.minLength(8),
    Validators.maxLength(20),
    CustomValidators.requiredUppercaseChar,
    CustomValidators.requiredLowercaseChar,
    CustomValidators.requiredNumberChar,
    CustomValidators.requiredSpecialChar,
  ])!;
}
