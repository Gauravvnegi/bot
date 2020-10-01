import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AdminDetailStatus } from 'libs/admin/shared/src/lib/models/detailsConfig.model';

@Injectable()
export class AdminDetailsService {

  private _isHealthDeclarationAccepted = new Subject<any>();
  private _isDocumentsAccepted = new Subject<any>();
  private _isPaymentAccepted = new Subject<any>();

  constructor() { }

  set HealthDeclarationStatus(status){
    this._isHealthDeclarationAccepted = status;
  }

  set DocumentStatus(status){
    this._isDocumentsAccepted = status;
  }

  set PaymentStatus(status){
    this._isPaymentAccepted = status;
  }

  get HealthDeclarationStatus(){
    return this._isHealthDeclarationAccepted;
  }

  get DocumentStatus(){
    return this._isDocumentsAccepted;
  }

  get PaymentStatus(){
    return this._isPaymentAccepted;
  }

}
