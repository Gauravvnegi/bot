import { Component, OnInit, Input } from '@angular/core';
import { InhouseRequest } from '../../data-models/statistics';

@Component({
  selector: 'hospitality-bot-inhouse-request-statistics',
  templateUrl: './inhouse-request-statistics.component.html',
  styleUrls: ['./inhouse-request-statistics.component.scss']
})
export class InhouseRequestStatisticsComponent implements OnInit {

  @Input() inhouseRequest: InhouseRequest = {
    requestApproved: 146,
    requestPending: 255,
  }
  totalRequest: number;
  requestPendingPercent: number;

  constructor() { }

  ngOnInit(): void {
    this.setTotal();
    this.setRequestPending();
  }

  setTotal() {
    this.totalRequest = this.inhouseRequest.requestApproved + this.inhouseRequest.requestPending;
  }

  setRequestPending() {
    this.requestPendingPercent = Math.abs((this.inhouseRequest.requestPending / (this.inhouseRequest.requestPending + this.inhouseRequest.requestApproved)) * 100);
  }

}
