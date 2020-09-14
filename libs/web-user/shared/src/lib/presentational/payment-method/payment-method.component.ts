import { Component, Output, EventEmitter, Input } from '@angular/core';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  providers: [ValidatorService],
})
export class PaymentMethodComponent {
  private _settings;
  private _defaultValue = {
    paymentConfigurations: [
      {
        id:"800be26e-94af-449e-a0fd-e05ff4dfe7f8",
        hotelId:"ca60640a-9620-4f60-9195-70cc18304edd",
        merchantId:"247468",
        gatewayType:"STRIPE",
        chainId:"c7121558-c1e9-11ea-b3de-0242ac130009",
        secretKey:"sk_test_51H2AI5LB2oBQqoXkRvo3Ps16vIqrFYV19KuyMz9RsShtEvhVTU9z5KMe33FWZOT93YljCEShJ4u4RpTSJW3GGv7Q007CGisieS",
        preAuth:true,
        exernalRedirect:true,
        iconUrl:"http://image.jpeg",
        paymentMethods: [
          {
            id:"03d6139c-a237-4dd7-80b1-8f7ce97dfe50",
            type:"NetBanking",
            imageUrl:"http://image.jpeg"
          }, {
            id:"6b251df8-bfed-4547-b3cc-f080883fde08",
            type:"Debit Card",
            imageUrl:"http://image.jpeg"
          }, {
            id:"f4df5e7d-960d-4b9b-a88e-bc7d767fdb6d",
            type:"Credit Card",          
            imageUrl:"http://image.jpeg"
          },
        ],
      },
      {
        id:"11e7534e-3479-4881-b9c4-a98f1cad12bf",
        hotelId:"ca60640a-9620-4f60-9195-70cc18304edd",
        merchantId:"260581",
        accessCode:"AVIM03HH34AL78MILA",
        gatewayType:"CCAVENUE",
        subAccountId:"TPCL",
        chainId:"c7121558-c1e9-11ea-b3de-0242ac130009",
        secretKey:"E61CF8DD4217405E6AC163F2A4454775",
        preAuth:false,
        exernalRedirect:true,
        iconUrl:"http://image.jpeg",
        paymentMethods:[
          {          
            id:"036b4a83-ec18-4af4-a3c7-79a03bc458c7",
            type:"Credit Card",
            imageUrl:"http://image.jpeg"
          }, {
            id:"1c1cc547-4171-425f-a92c-910a7698e2c9",
            type:"Debit Card",
            imageUrl:"http://image.jpeg"
          }, {
            id:"cfb0a1ef-4c40-44a8-91fa-630efe6cf2dd",
            type:"NetBanking",
            imageUrl:"http://image.jpeg"
          },
        ],
      },
    ]
  };
  @Input('settings') set settings(value) {
    this._settings = { ...this._defaultValue, ...value };
  }

  get settings() {
    if (this._settings !== undefined) {
      return { ...this._defaultValue, ...this._settings };
    } else {
      return this._defaultValue;
    }
  }
  @Output() paymentMethod = new EventEmitter();
  setOption(val) {
    this.paymentMethod.emit({ methodData: val });
  }
}
