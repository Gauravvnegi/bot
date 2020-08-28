import { Component, OnInit, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

@Component({
  selector: 'web-user-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [ValidatorService],
})
export class NumberInputComponent extends BaseComponent {

  private defaultValue = {
    prefix: '',
    suffix: '',
    includeThousandsSeparator: true,
    thousandsSeparatorSymbol: ',',
    allowDecimal: true,
    decimalSymbol: '.',
    decimalLimit: 2,
    integerLimit: null,
    requireDecimal: false,
    allowNegative: false,
    allowLeadingZeroes: false
  };
  _numberMask;
  @Input('numberMask') set numberMask(value: {
    
  }) {
    this._numberMask = createNumberMask({ ...this.defaultValue, ...value });
  }

  get numberMask() {
    return createNumberMask({ ...this.defaultValue, ...this._numberMask });
  }
}
