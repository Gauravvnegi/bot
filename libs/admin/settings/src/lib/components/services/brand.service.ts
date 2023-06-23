import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { Observable } from 'rxjs';

@Injectable()
export class BrandService extends ApiService {

  createBrand(hotelId: string, data: any): Observable<any> {
    return this.post(
      `/api/v1/entity/onboarding?source=CREATE_WITH&onboardingType=BRAND`,
      data
    );
  }
}
