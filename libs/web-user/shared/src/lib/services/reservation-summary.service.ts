import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { FormArray } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ReservationSummaryService {
  private convertPathToArray(searchPath: string): string[] {
    return searchPath.split('.');
  }

  private getArrayFieldName(searchPath: string) {
    return searchPath.substr(0, searchPath.indexOf('$') - 1);
  }

  private getNestedProp(obj, arrayPropName) {
    const nestedProp = _.get(obj, arrayPropName);
    return nestedProp ? nestedProp : '';
  }

  private convertStringToArray(str: string): string[] {
    return str
      .replace(/\s*,\s*/gi, ',')
      .trim()
      .split(',');
  }

  getValidationIcon(component: any, parentForm: FormArray): string {
    if (component.controlName) {
      const controlStatus = this.getControlValidityStatus(
        component.controlName,
        parentForm
      );

      return controlStatus.toLowerCase() === 'invalid'
        ? 'error_outline'
        : 'check_circle_outline';
    }

    return '';
  }

  getValue(component: any, parentForm: FormArray) {
    const formValues: any = parentForm.getRawValue();

    if (component.path) {
      return this.getValuefromPath(component, formValues);
    }
  }

  private getValuefromPath(component: any, formValues: any) {
    const searchPaths: string[] = this.convertStringToArray(component.path);
    let value: string = '';

    if (component.pathType == 'object') {
      value = '';

      _.find(formValues, (formValue) => {
        for (const path of searchPaths) {
          const tempValue = _.get(formValue, path);
          //to be removed and replaced with transformation
          if (tempValue) {
            value = value.concat(tempValue).concat(' ');
          }
        }
      });
    }

    if (component.pathType == 'array') {
      value = '';

      for (const formValue of formValues) {
        const arrayPropPath: string = this.getArrayFieldName(
          component.arrayPropPath
        );
        const nestedArrayField = this.getNestedProp(formValue, arrayPropPath);

        /* for (const val of nestedArrayField) {
          for (const path of searchPaths) {
            const pathArray: string[] = this.convertPathToArray(path);
            const tempVal = _.get(val, pathArray[pathArray.length - 1]);

            if (tempVal) {
              value = value.concat(tempVal).concat(' ');
            }
          }
        } */

        if (nestedArrayField) return nestedArrayField;
      }
    }

    return value.trim();
  }

  getControlValidityStatus(controlName: string, parentForm: FormArray) {
    let controlStatus: string;

    parentForm.controls.forEach((control) => {
      if (control.get(controlName)) {
        controlStatus = _.toLower(control.get(controlName).status);
      }
    });

    return controlStatus;
  }
}
