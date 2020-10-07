import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AdminDetailStatus } from 'libs/admin/shared/src/lib/models/detailsConfig.model';

@Injectable()
export class AdminDetailsService {

  private _isSelectedGuestInternational = new Subject<any>();
  private _isHealthDeclarationAccepted = new Subject<any>();
  private _isDocumentsAccepted = new Subject<any>();
  private _isPaymentAccepted = new Subject<any>();

  constructor() { }

  set healthDeclarationStatus(status){
    this._isHealthDeclarationAccepted = status;
  }

  set documentStatus(status){
    this._isDocumentsAccepted = status;
  }

  set paymentStatus(status){
    this._isPaymentAccepted = status;
  }

  set guestNationality(nationality){
    this._isSelectedGuestInternational.next(nationality);
  }

  get healthDeclarationStatus(){
    return this._isHealthDeclarationAccepted;
  }

  get documentStatus(){
    return this._isDocumentsAccepted;
  }

  get paymentStatus(){
    return this._isPaymentAccepted;
  }

  get guestNationality(): Observable<any>{
    return this._isSelectedGuestInternational.asObservable();
  }

}
