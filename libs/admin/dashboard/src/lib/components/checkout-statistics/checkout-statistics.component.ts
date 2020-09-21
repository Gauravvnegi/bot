import { Component, OnInit, Input } from '@angular/core';
import { ExpressCheckOut } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-checkout-statistics',
  templateUrl: './checkout-statistics.component.html',
  styleUrls: ['./checkout-statistics.component.scss']
})
export class CheckoutStatisticsComponent implements OnInit {

  @Input() expectedCheckout: ExpressCheckOut;
  constructor() { }

  ngOnInit(): void {
    debugger;
    console.log(this.expectedCheckout);
  }

}
