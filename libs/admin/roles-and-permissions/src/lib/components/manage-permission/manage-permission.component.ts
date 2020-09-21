import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hospitality-bot-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.scss'],
})
export class ManagePermissionComponent implements OnInit {
  permissionConfigs = [
    {
      entity: 'preCheckin',
      label: 'Pre-Checkin',
      permissions: [
        {
          name: 'view',
          label: 'View General Info',
        },
      ],
    },
    {
      entity: 'preCheckin',
      label: 'Pre-Checkin',
      permissions: [
        {
          name: 'view',
          label: 'View General Info',
        },
      ],
    },
  ];
  constructor() {}

  ngOnInit(): void {}
}

//auth -- x-authorization
//x-acess--token   x-access-token
//refresh-token x-refresh-authorization
//x-acess-refresh  x-access-refresh-token
