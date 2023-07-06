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
  entityId: string;
  menuId: string;
  navRoutes: any[];
  pageTitle: string;

  constructor(protected router: Router, protected route: ActivatedRoute) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const outletId = snapshot?.params['outletId'];
        const brandId = snapshot?.params['brandId'];
        const entityId = snapshot?.params['entityId'];
        const menuId = snapshot?.params['menuId'];
        if (outletId) this.outletId = outletId;
        if (brandId) this.brandId = brandId;
        if (entityId) this.entityId = entityId;
        if (menuId) this.menuId = menuId;
      }
    );
  }

  initComponent(routeName: OutletBusinessRoutes) {
    const { navRoutes, title } = this.entityId
      ? getRoutes(routeName, true)
      : outletBusinessRoutes[routeName];
    navRoutes[2].link = navRoutes[2].link.replace(':brandId', this.brandId);
    navRoutes[3].link = navRoutes[3].link.replace(':entityId', this.entityId);

    this.navRoutes = navRoutes;

    this.pageTitle = title;
  }
}
