import { Component, OnInit, Input } from '@angular/core';
import { InhouseRequest } from '../../data-models/statistics.model';

@Component({
  selector: 'hospitality-bot-inhouse-request-statistics',
  templateUrl: './inhouse-request-statistics.component.html',
  styleUrls: ['./inhouse-request-statistics.component.scss'],
})
export class InhouseRequestStatisticsComponent implements OnInit {
  @Input() inhouseRequest: InhouseRequest;
  // totalRequest: number;
  requestPendingPercent: number;

  constructor() {}

  ngOnChanges() {
    this.setRequestPending();
  }

  ngOnInit(): void {
    //   this.setTotal();
    // this.setRequestPending();
  }

  // setTotal() {
  //   this.totalRequest = this.inhouseRequest.requestApproved + this.inhouseRequest.requestPending;
  // }

  setRequestPending() {
    this.requestPendingPercent = Math.abs(
      (this.inhouseRequest.requestPending / this.inhouseRequest.totalRequest) *
        100
    );
  }
}
