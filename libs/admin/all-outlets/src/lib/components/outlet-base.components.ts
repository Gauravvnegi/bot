import { Component } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  OutletAddRoutes,
  OutletEditRoutes,
  correspondingEditRouteName,
  hasId,
  navRoutes,
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
  menuItemId: string;
  foodPackageId: string;
  navRoutes: any[];
  pageTitle: string;

  constructor(protected router: Router, protected route: ActivatedRoute) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const outletId = snapshot?.params['outletId'];
        const brandId = snapshot?.params['brandId'];
        const entityId = snapshot?.params['entityId'];
        const menuId = snapshot?.params['menuId'];
        if (outletId) {
          this.outletId = outletId;
        }
        if (brandId) this.brandId = brandId;
        if (entityId) {
          this.entityId = entityId;
        }
        if (menuId) this.menuId = menuId;
      }
    );
  }

  getRoutes(routeName: string, isHotel: boolean, isEdit?: boolean) {
    routeName = isEdit ? correspondingEditRouteName[routeName] : routeName;

    if (isHotel) {
      // entityId is present

      //clone
      const updatedRoutes = Object.assign({}, outletBusinessRoutes[routeName]);
      updatedRoutes.navRoutes = [...outletBusinessRoutes[routeName].navRoutes];

      updatedRoutes.navRoutes.splice(3, 0, navRoutes.editHotel);

      if (isEdit)
        updatedRoutes.navRoutes.forEach((element) => {
          if (element.link.includes(':brandId/outlet')) {
            element.link = element.link.replace(
              ':brandId/outlet',
              ':brandId/hotel/:entityId/outlet'
            );
          }
        });

      return updatedRoutes;
    }
  }

  initComponent(routeName: OutletAddRoutes | 'importService') {
    const { navRoutes, title } = this.entityId
      ? this.getRoutes(
          //edit hotel case and add hotel is in business module
          routeName,
          this.entityId ? true : false,
          this[hasId[routeName]] ? true : false
        )
      : outletBusinessRoutes[
          this[hasId[routeName]]
            ? correspondingEditRouteName[routeName]
            : routeName
        ];

    navRoutes[2].link = navRoutes[2].link
      .replace(':brandId', this.brandId)
      .replace(':outletId', this.outletId)
      .replace(':entityId', this.entityId);

    navRoutes[3].link = navRoutes[3].link
      .replace(':entityId', this.entityId)
      .replace(':brandId', this.brandId)
      .replace(':outletId', this.outletId);

    if (navRoutes[4]?.link.includes(':outletId')) {
      navRoutes[4].link = navRoutes[4]?.link
        .replace(':brandId', this.brandId)
        .replace(':outletId', this.outletId)
        .replace(':entityId', this.entityId);
    }
    this.navRoutes = navRoutes;

    this.pageTitle = title;
  }
}
