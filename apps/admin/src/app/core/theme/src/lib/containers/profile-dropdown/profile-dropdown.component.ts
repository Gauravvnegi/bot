import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';

@Component({
  selector: 'admin-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent implements OnInit {
  @Input() items = [];
  @Output() onProfileAction = new EventEmitter();
  constructor(public userDetailService: UserDetailService) {}

  ngOnInit(): void {}

  profileAction(item) {
    this.onProfileAction.emit(item);
  }
}
