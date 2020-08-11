import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'web-user-payment-card',
  templateUrl: './payment-card.component.html',
  styleUrls: ['./payment-card.component.scss']
})
export class PaymentCardComponent implements OnInit, OnChanges {

  @Input() cardDetail;
  @Input() cardIcon: string;
  cardNumber: string;
  
  constructor() { }

  ngOnInit(): void {
    this.cardNumber = "xxxx xxxx xxxx xxxx";
  }

  ngOnChanges() {
    if(this.cardDetail){
      this.cardNumber = this.cardDetail.cardNumber;
    }
  }

}
