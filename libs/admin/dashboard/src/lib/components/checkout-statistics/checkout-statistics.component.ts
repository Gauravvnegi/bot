import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'hospitality-bot-checkout-statistics',
  templateUrl: './checkout-statistics.component.html',
  styleUrls: ['./checkout-statistics.component.scss']
})
export class CheckoutStatisticsComponent implements OnInit {

  @Input() expectedCheckout: number = 8;
  constructor() { }

  ngOnInit(): void {
  }

}
