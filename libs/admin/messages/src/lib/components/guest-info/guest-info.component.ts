import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit {
  @Output() closeInfo = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  closeGuestInfo() {
    this.closeInfo.emit({ close: true });
  }
}
