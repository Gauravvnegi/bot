import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-add-guest-list',
  templateUrl: './add-guest-list.component.html',
  styleUrls: ['./add-guest-list.component.scss'],
})
export class AddGuestListComponent implements OnInit {
  @Output() onClose = new EventEmitter<boolean>();
  constructor() {}

  ngOnInit(): void {}

  close() {
    this.onClose.emit(true);
  }
}
