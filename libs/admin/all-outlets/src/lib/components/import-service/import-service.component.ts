import { Component, OnInit } from '@angular/core';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { outletBusinessRoutes } from '../../constants/routes';

@Component({
  selector: 'hospitality-bot-import-service',
  templateUrl: './import-service.component.html',
  styleUrls: ['./import-service.component.scss'],
})
export class ImportServiceComponent implements OnInit {
  pageTitle: string = 'Import Services';
  navRoutes: NavRouteOptions = [];
  constructor() {
    const { navRoutes, title } = outletBusinessRoutes['importService'];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {}

  saveForm(serviceIds: string[]) {}
}
