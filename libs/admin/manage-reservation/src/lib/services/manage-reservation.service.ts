import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils'; 
import { BehaviorSubject, Observable } from 'rxjs'; 
import { ReservationTableValue } from '../constants/reservation-table';
import { QueryConfig } from '../types/reservation.type'; 
import { map } from 'rxjs/operators'; 
import { APIManipulator } from '../models/dummy.model';
@Injectable()
export class ManageReservationService extends ApiService {  
  selectedTable = new BehaviorSubject<ReservationTableValue>(ReservationTableValue.ALL);
  updateReservation<T, K>(
    hotelId: string,
    reservationItemId: string,
    data: any,
    config?: QueryConfig
  ): Observable<K> { 
    return this.patch(`/api/v1/entity/9a43e691-a790-4e74-bb6a-d6bc8a3394e7/library/45eb6819-1b8e-43fb-9c07-b37598253943${ '?order=DESC&type=PACKAGE&limit=5' }`, { active: true }, );
  } 

  getReservationItems<T>(hotelId: string, config?: QueryConfig): Observable<T> { 
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`)
    .pipe(
      map((response:any)=>{
        new APIManipulator().manipulateAPI(response);
        return response;
      })
    );
  }

  getReservationItemsByCategory<T>(
    hotelId: string, 
    config?: QueryConfig,
    reservationType?:string
  ): Observable<T> { 
    return this.get(`/api/v1/entity/${hotelId}/library${config?.params ?? ''}`)
    .pipe(
      map((response:any)=>{ 
        new APIManipulator().filterReservation(response,reservationType);
        return response;
      })
    );
  }
   
  exportCSV(hotelId: string, config?: QueryConfig) {
    return this.get(
      `/api/v1/entity/${hotelId}/library/export${config?.params ?? ''}`,
      {
        responseType: 'blob',
      }
    );
  }
}
