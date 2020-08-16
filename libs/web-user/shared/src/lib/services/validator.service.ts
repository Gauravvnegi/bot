import { Inject, Injectable, InjectionToken } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { merge, of, Subject } from 'rxjs';

export const defaultErrors = {
  required: (error, label, msg?) => `${label} is required`,
  maxlength: ({ requiredLength, actualLength }, label, msg?) =>
    `Expect ${requiredLength} but got ${actualLength}`,
  minlength: ({ requiredLength, actualLength }, label, msg?) =>
    `Expect ${requiredLength} but got ${actualLength}`,
  pattern: (error, label, msg?) => {
    if (msg) {
      return msg;
    }

    return `Invalid input`;
  },
};

export const customPatternValid = (config: any): ValidatorFn => {
  return (control: FormControl) => {
    let urlRegEx: RegExp = config.pattern;
    if (control.value && !control.value.match(urlRegEx)) {
      return config;
    } else {
      return null;
    }
  };
};

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors,
});

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  errorMessageEvent = new Subject();
  constructor(@Inject(FORM_ERRORS) private errors) {}

  attachValidators(fieldComponent) {
    let control = fieldComponent.parentForm.get(
      fieldComponent.name
    ) as FormControl;

    merge(control.valueChanges, of(control.invalid))
      .pipe(untilDestroyed(fieldComponent))
      .subscribe(() => {
        const controlErrors = control.errors;

        if (controlErrors) {
          // if error is found
          const errorType = Object.keys(controlErrors)[0];
          const getError = this.errors[errorType];

          this.errorMessageEvent.next(
            getError(
              controlErrors[errorType],
              fieldComponent.settings.label,
              controlErrors.msg
            )
          );
        }
      });
  }

  addValidators(fieldComponent) {
    if (fieldComponent.settings && fieldComponent.settings.validation) {
      let control = fieldComponent.parentForm.get(
        fieldComponent.name
      ) as FormControl;
      let validatorFunc = [];
      if (fieldComponent.settings.validation.systemValidation) {
        validatorFunc = fieldComponent.settings.validation.systemValidation.map(
          (validation) => Validators[validation]
        );
      }

      if (
        fieldComponent.settings.validation.customValidation &&
        fieldComponent.settings.validation.customValidation.length
      ) {
        validatorFunc = [
          ...validatorFunc,
          ...fieldComponent.settings.validation.customValidation.map(
            (validation) => {
              if (validation.type == 'customPatternValid') {
                return customPatternValid(validation.params);
              }
            }
          ),
        ];
      }
      control.setValidators(validatorFunc);

      control.updateValueAndValidity();
    }
  }
}
