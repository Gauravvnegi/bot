import { Component, OnInit } from '@angular/core';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-import-service',
  templateUrl: './import-service.component.html',
  styleUrls: ['./import-service.component.scss'],
})
export class ImportServiceComponent implements OnInit {
  pageTitle: string = 'Import Services';
  navRoutes: NavRouteOptions = [
    {
      label: 'Business',
      link: '/admin/business',
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  saveForm(serviceIds: string[]) {
    console.log(serviceIds, 'serviceIds');

    //if id is there, update the service
  }
}
