import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

function minArrayValueLength(number: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isError = control.value?.length < number;
    return isError ? { minValue: control.value } : null;
  };
}

function notAllowedChr(chr: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const isError = control.value?.toString().includes(chr);
    return isError ? { notAllowedChr: control.value } : null;
  };
}

function requiredLength(length: number): ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (
      value &&
      (value.toString().length < length || value.toString().length > length)
    ) {
      return {
        maxLength: {
          valid: false,
          message: `Length should be ${length} digits.`,
        },
      };
    }
    return null;
  };
}

const CustomValidators = {
  minArrayValueLength,
  notAllowedChr,
  requiredLength,
};

export default CustomValidators;
