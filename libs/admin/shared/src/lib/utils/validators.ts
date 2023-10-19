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

function requiredLength(length: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    const isError =
      value &&
      (value.toString().length < length || value.toString().length > length);
    return isError ? { requiredLength: value } : null;
  };
}

function urlValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const urlPattern = /^(http|https):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:/~+#]*[\w\-@?^=%&/~+#])?$/;
    const valid = urlPattern.test(control.value);
    return valid ? null : { invalidUrl: control.value };
  };
}

const CustomValidators = {
  minArrayValueLength,
  notAllowedChr,
  requiredLength,
  urlValidator,
};

export default CustomValidators;
