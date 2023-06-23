import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { ConfigService, Option } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { PaymentMethodList } from '../../../models/reservations.model';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: [
    './payment-method.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class PaymentMethodComponent implements OnInit {
  // @Input() paymentOptions: Option[] = [];
  // @Input() currencies: Option[] = [];

  currencies: Option[] = [];
  paymentOptions: Option[] = [];
  hotelId: string;

  $subscription = new Subscription();

  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private manageReservationService: ManageReservationService,
    private globalFilterService: GlobalFilterService,
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initConfig();
    this.getPaymentMethod();
  }

  initConfig() {
    this.configService.$config.subscribe((value) => {
      if (value) {
        const { currencyConfiguration } = value;
        this.currencies = currencyConfiguration.map(({ key, value }) => ({
          label: key,
          value,
        }));
        this.controlContainer.control.get('paymentMethod').patchValue({
          currency: this.currencies[0].value,
        });
      }
    });
  }

  getPaymentMethod(): void {
    this.$subscription.add(
      this.manageReservationService.getPaymentMethod(this.hotelId).subscribe(
        (response) => {
          const types = new PaymentMethodList()
            .deserialize(response)
            .records.map((item) => item.type);
          const labels = [].concat(
            ...types.map((array) => array.map((item) => item.label))
          );
          this.paymentOptions = labels.map((label) => ({
            label: label,
            value: label,
          }));
        },
        (error) => {}
      )
    );
  }
}
