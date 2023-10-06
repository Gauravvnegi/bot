import { Component, OnInit } from '@angular/core';
import { cols, title, usersList } from '../../constants/manage-login.table';

@Component({
  selector: 'hospitality-bot-manage-login-users',
  templateUrl: './manage-login-users.component.html',
  styleUrls: ['./manage-login-users.component.scss'],
})
export class ManageLoginUsersComponent implements OnInit {
  columns = cols;
  title = title;
  usersList = usersList;
  constructor() {}

  ngOnInit(): void {}
}
