import { Component, OnInit } from '@angular/core';
import { cols, title, usersList } from '../../constants/manage-login.table';

@Component({
  selector: 'hospitality-bot-manage-logged-users',
  templateUrl: './manage-logged-users.component.html',
  styleUrls: ['./manage-logged-users.component.scss'],
})
export class ManageLoggedUsersComponent implements OnInit {
  title = title;
  cols = cols;
  users = usersList;
  constructor() {}

  ngOnInit(): void {}
}
