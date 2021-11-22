import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-requests',
  templateUrl: './guest-requests.component.html',
  styleUrls: ['./guest-requests.component.scss'],
})
export class GuestRequestsComponent implements OnInit {
  @Input() requestList;
  constructor() {}

  ngOnInit(): void {}
}
