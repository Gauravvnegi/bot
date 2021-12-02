import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'admin-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent implements OnInit {
  @Input() items = [];
  @Output() onProfileAction = new EventEmitter();
  constructor(public userService: UserService) {}

  ngOnInit(): void {}

  profileAction(item) {
    this.onProfileAction.emit(item);
  }
}
