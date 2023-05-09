import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class BrandService extends ApiService {

  createBrand(data: any): Observable<any> {
    console.log('data', data);
    return this.post(
      `/api/v2/entity/onboarding?source=CREATE_WITH&onboardingType=BRAND`,
      data
    );
  }
}
