import { Component, OnInit, Input } from '@angular/core';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';

@Component({
  selector: 'admin-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss'],
})
export class ProfileDropdownComponent implements OnInit {
  @Input() items = [];

  constructor(public userDetailService: UserDetailService) {}

  ngOnInit(): void {}
}
