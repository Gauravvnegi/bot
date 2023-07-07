import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from '../form-component/form.components';
import { ControlContainer, FormControl, FormGroup } from '@angular/forms';
import { Option } from '../../types/form.type';

@Component({
  selector: 'hospitality-bot-discount-form',
  templateUrl: './discount-form.component.html',
  styleUrls: ['./discount-form.component.scss'],
})
export class DiscountFormComponent extends FormComponent implements OnInit {
  currencies: Option[] = [{ label: 'INR', value: 'INR' }];
  discountTypes: Option[] = [
    { label: '%Off', value: 'PERCENTAGE' },
    { label: 'Flat', value: 'FLAT' },
  ];

  className = 'half-width'

  errorMessages = {
    required: 'This is a required field.',
    isPriceLess: 'Price cannot be less than the discount value.',
    isDiscountMore: 'Discount value cannot be more than price.',
    moreThan100: 'Cannot be more than 100%.',
    maxOccupancy: 'Value cannot be more than max occupancy.',
    notAllowedChr: 'Decimal are not allowed.',
    min: 'Value can not be less than 0.',
    moreThanTotal: 'Cannot be more than total',
  };

  originalPrice = 'originalPrice';
  currency = 'currency';
  discountValue = 'discountValue';
  discountType = 'discountType';
  discountedPrice = 'discountedPrice';
  discountedPriceCurrency = 'discountedPriceCurrency';

  originalPriceLabel = 'Original Price'
  discountLabel = 'Discount Type'
  discountedPriceLabel = 'Discounted Price'

  @Input() set controls(value: controlSettings) {
    Object.entries(value)?.forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @Input() set labels(value: labelSettings){
    Object.entries(value)?.forEach(([key,value])=>{
      this[key]=value;
    })
  }

  @Input() set settings(value: formSettings){
    Object.entries(value)?.forEach(([key,value]) =>{
      this[key]=value;
    })
  }

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.registerRateAndDiscountChange();
  }

  /**
   * @function registerRateAndDiscountChange Subscribe to rate and discount value subscription to get discounted price
   */
  registerRateAndDiscountChange() {
    const originalPrice = this.controlContainer.control.get(this.originalPrice);
    const discountValue = this.controlContainer.control.get(this.discountValue);
    const discountType = this.controlContainer.control.get(this.discountType);
    const currency = this.controlContainer.control.get(this.currency);
    const discountedPriceCurrency = this.controlContainer.control.get(
      this.discountedPriceCurrency
    );
    const discountedPrice = this.controlContainer.control.get(
      this.discountedPrice
    );

    /**
     * @function setDiscountValueAndErrors To update the discount value
     * @returns error type
     */
    const setDiscountValueAndErrors = () => {
      const price = +originalPrice.value ?? 0;
      const discount = +(discountValue.value ?? 0);
      const type = discountType.value;

      if (price)
        discountedPrice.patchValue(
          type === 'NUMBER'
            ? price - discount
            : Math.round(
                (price - (price * discount) / 100 + Number.EPSILON) * 100
              ) / 100
        );

      if (type === 'NUMBER' && discount > price) {
        return 'isNumError';
      }

      if (type === 'PERCENTAGE' && discount > 100) {
        return 'isPercentError';
      }

      if (discount < 0) {
        return 'isMinError';
      }
    };

    const clearError = () => {
      originalPrice.setErrors(null);
      discountValue.setErrors(null);
    };

    /* Original price Subscription */
    originalPrice.valueChanges.subscribe(() => {
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        originalPrice.setErrors({ isPriceLess: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
      if (originalPrice.value < 0) {
        originalPrice.setErrors({ min: true });
      }
    });

    /**
     * @function discountSubscription To handle changes in discount value
     */
    const discountSubscription = () => {
      discountValue.enable({ emitEvent: false });
      clearError();
      const error = setDiscountValueAndErrors();
      if (error === 'isNumError') {
        discountValue.setErrors({ isDiscountMore: true });
      }
      if (error === 'isPercentError') {
        discountValue.setErrors({ moreThan100: true });
      }
      if (error === 'isMinError') {
        discountValue.setErrors({ min: true });
      }
    };

    /* Discount Subscription */
    discountValue.valueChanges.subscribe(discountSubscription);
    discountType.valueChanges.subscribe(discountSubscription);

    /* Currency Subscription */
    currency.valueChanges.subscribe((res) => {
      discountedPriceCurrency.setValue(res);
      // variablePriceCurrency.setValue(res);
    });
  }
}

type controlSettings = {
  originalPrice: string;
  currency: string;
  discountValue: string;
  discountType: string;
  discountedPrice: string;
  discountedPriceCurrency: string;
};

type labelSettings = {
  originalyPriceLabel: string;
  discountLable: string;
  discountedPriceLabel: string;
}

type formSettings = {
  className: string;
}
