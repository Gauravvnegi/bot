import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable()
export class AuthService {

  constructor() { }

  matchPasswords(controlName: string, matchingControlName: string){
    return (formGroup: FormGroup)=>{
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  }
}
