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
    paymentConfigurations: { },
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
  setOption(val, type) {
    this.paymentMethod.emit({ methodData: val, methodType: type });
  }
}
