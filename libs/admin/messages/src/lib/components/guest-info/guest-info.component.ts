import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'hospitality-bot-guest-info',
  templateUrl: './guest-info.component.html',
  styleUrls: ['./guest-info.component.scss'],
})
export class GuestInfoComponent implements OnInit {
  @Output() closeInfo = new EventEmitter();
  @ViewChild('matTab') matTab: MatTabGroup;
  selectedIndex = 0;
  buttonConfig = [
    { button: true, label: 'Edit Details', icon: 'assets/svg/user.svg' },
    { button: true, label: 'Map Details', icon: 'assets/svg/user.svg' },
    { button: false, label: 'Edit Details', icon: 'assets/svg/user.svg' },
    { button: false, label: 'Map Details', icon: 'assets/svg/user.svg' },
  ];
  constructor() {}

  ngOnInit(): void {}

  closeGuestInfo() {
    this.closeInfo.emit({ close: true });
  }

  onTabChanged(event) {
    this.selectedIndex = event.index;
  }
}
