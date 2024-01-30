import { Component, OnInit } from '@angular/core';
import { NavRouteOption } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-kot',
  templateUrl: './kot.component.html',
  styleUrls: ['./kot.component.scss'],
})
export class KotComponent implements OnInit {
  navRoutes: NavRouteOption[] = [
    {
      label: 'Manage KOT',
      link: './',
    },
  ];

  welcomeMessage: string = 'Welcome to KOT Dashboard';

  constructor() {}

  ngOnInit(): void {}

  /**
   * @function onGlobalTabFilterChanges To listen to global tab filter changes
   * @param value
   */

  onGlobalTabFilterChanges(event) {
    //to cancel previous api call in between when tab filter changes
    // this.cancelRequests$.next();
    // this.isRestaurant = event.outletType === 'RESTAURANT' ? true : false;
    // this.entityId = event.entityId[0];
    // this.tabFilterIdx = 0;
    // this.initTableValue();
  }
}
