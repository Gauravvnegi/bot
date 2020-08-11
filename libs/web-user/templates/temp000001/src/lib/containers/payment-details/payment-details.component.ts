import { CardType } from './../../../../../../shared/src/lib/data-models/card';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Regex } from './../../../../../../shared/src/lib/data-models/regexConstant';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { PaymentDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/PaymentDetailsConfig.model';
import { PaymentDetailsService } from 'libs/web-user/shared/src/lib/services/payment-details.service';

@Component({
  selector: 'hospitality-bot-payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
})
export class PaymentDetailsComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() cardType: string;
  @Output()
  savePaymentDetails = new EventEmitter<string>();

  @ViewChild(MatAccordion) accordion: MatAccordion;
  @ViewChild('nextButton') nextButton;

  paymentDetailsForm: FormGroup;
  paymentDetailsConfig: PaymentDetailsConfigI;
  isPayAtDesk: boolean = true;
  hotelConfig;
  maskRegex;

  constructor(
    private fb: FormBuilder,
    private _stepperService: StepperService,
    private _paymentDetailsService: PaymentDetailsService
  ) {}

  ngOnInit(): void {
    this.maskRegex = Regex.CREDIT_CARD_MASK_REGEX;
    this.initPaymentDetailForm();
    this.paymentDetailsConfig = this._paymentDetailsService.setFieldConfigForPaymentDetails(
      Regex.CREDIT_CARD_MASK_REGEX
    );
    this.hotelConfig =
      this.hotelConfiguration && this.hotelConfiguration.hotelPaymentConfig;
    this._paymentDetailsService.payAtDesk = this.isPayAtDesk;
    // assigned static values as api returns false , remove below code when api returns true for any one payment method
    this.hotelConfig.onlinePayment = true;
    this.hotelConfig.payAtDesk = true;
    ///////
    if (!this.hotelConfig.onlinePayment) {
      this.changePaymentMethod();
    }
  }

  /**
   * Initialize form
   */
  initPaymentDetailForm() {
    const date = new Date();
    this.paymentDetailsForm = this.fb.group({
      name: ['', [Validators.required]],
      cardNumber: [
        '',
        [Validators.required, Validators.pattern(Regex.CREDIT_CARD_REGEX)],
      ],
      month: [date.getMonth(), [Validators.required]],
      year: [date.getFullYear(), [Validators.required]],
      cvv: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(Regex.NUMBER_REGEX),
        ],
      ],
    });

    this.parentForm.addControl('paymentDetails', this.paymentDetailsForm);
  }

  changePaymentMethod() {
    this.isPayAtDesk = !this.isPayAtDesk;
    this._paymentDetailsService.payAtDesk = this.isPayAtDesk;
  }

  get paymentInfo(): string {
    return this.paymentDetailsForm.getRawValue();
  }

  get hotelConfiguration() {
    return this._paymentDetailsService.paymentSummaryDetails.hotelConfigDetail;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }
}
