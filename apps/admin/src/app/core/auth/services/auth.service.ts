import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';

@Injectable()
export class AuthService extends ApiService{

  login(loginData){
    return this.post(`/api/v1/user/login`, loginData);
  }

  forgotPassword(email){
    return this.put(`/api/v1/user/forgot-password?email=${email}`,'');
  }

  changePassword(changeToken, password){
    return this.put(`/api/v1/user/change-password?token=${changeToken}&password=${password}`, '');
  }

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
