import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { ApiService } from 'libs/shared/utils/src/lib/api.service';
@Injectable()
export class AdminDetailsService extends ApiService {
  // TO-DO to confirm where to put this function
  getUserShareIconByNationality(nationality): Observable<any> {
    return this.get(
      `/api/v1/countries/support-applications?nationality=${nationality}`
    );
  }
}
