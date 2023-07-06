import { Component } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  OutletBusinessRoutes,
  getRoutes,
  outletBusinessRoutes,
} from '../constants/routes';

@Component({
  selector: 'hospitality-bot-outlet-base',
  template: '',
})
export class OutletBaseComponent {
  outletId: string;
  brandId: string;
  hotelId: string;
  menuId: string;
  navRoutes: any[];
  pageTitle: string;

  constructor(protected router: Router, protected route: ActivatedRoute) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const outletId = snapshot?.params['outletId'];
        const brandId = snapshot?.params['brandId'];
        const hotelId = snapshot?.params['hotelId'];
        const menuId = snapshot?.params['menuId'];
        if (outletId) this.outletId = outletId;
        if (brandId) this.brandId = brandId;
        if (hotelId) this.hotelId = hotelId;
        if (menuId) this.menuId = menuId;
      }
    );
  }

  initComponent(routeName: OutletBusinessRoutes) {
    const { navRoutes, title } = this.hotelId
      ? getRoutes(routeName, true)
      : outletBusinessRoutes[routeName];
    navRoutes[2].link = navRoutes[2].link.replace(':brandId', this.brandId);
    navRoutes[3].link = navRoutes[3].link.replace(':hotelId', this.hotelId);

    this.navRoutes = navRoutes;

    this.pageTitle = title;
  }
}
