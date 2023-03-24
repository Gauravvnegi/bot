import { AbstractControl, ValidatorFn } from '@angular/forms';

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

const CustomValidators = {
  minArrayValueLength,
  notAllowedChr,
};

export default CustomValidators;
