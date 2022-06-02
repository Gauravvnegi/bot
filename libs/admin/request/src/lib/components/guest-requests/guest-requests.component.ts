import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-requests',
  templateUrl: './guest-requests.component.html',
  styleUrls: ['./guest-requests.component.scss'],
})
export class GuestRequestsComponent implements OnChanges {
  @Input() requestList;
  constructor() {}
  optionLabels = ['Pending', 'Closed', 'Timeout'];

  preArrivalOptions = ['Accept', 'Reject', 'Closed', 'Pending'];

  ngOnChanges() {}
}
