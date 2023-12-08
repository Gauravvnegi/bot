import { Component } from '@angular/core';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  OutletAddRoutes,
  correspondingEditRouteName,
  hasId,
  navRoutes,
  outletBusinessRoutes,
} from '../constants/routes';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

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
  navRoutes: any[] = [];
  pageTitle: string = 'Outlet';

  constructor(
    protected router: Router,
    protected route: ActivatedRoute,
    protected routesConfigService: RoutesConfigService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const outletId = snapshot?.params['outletId'];
        const brandId = snapshot?.params['brandId'];
        const entityId = snapshot?.params['entityId'];
        const menuId = snapshot?.params['menuId'];
        const menuItemId = snapshot?.params['menuItemId'];
        const foodPackageId = snapshot?.params['foodPackageId'];
        if (outletId) {
          console.log('outletId', outletId);
          this.outletId = outletId;
        }
        if (brandId) this.brandId = brandId;
        if (entityId) {
          this.entityId = entityId;
        }
        if (menuId) {
          this.menuId = menuId;
        }

        if (menuItemId) this.menuItemId = menuItemId;

        if (foodPackageId) this.foodPackageId = foodPackageId;
      }
    );
  }

  initNavRoutes() {
    this.routesConfigService?.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  getRoutes(routeName, isHotel, isEdit) {
    routeName = isEdit ? correspondingEditRouteName[routeName] : routeName;

    if (isHotel) {
      // entityId is present

      // Deep clone
      const outletBusinessRoutesClone = JSON.parse(
        JSON.stringify(outletBusinessRoutes)
      );

      const updatedRoutes = this.deepCloneRoutes(
        outletBusinessRoutes[routeName]
      );
      //insert edit hotel route in between edit brand and add outlet or edit outlet
      updatedRoutes.navRoutes.splice(1, 0, navRoutes.editHotel);

      if (isHotel) {
        updatedRoutes.navRoutes.forEach((element) => {
          if (element.link.includes(':brandId/outlet')) {
            element.link = element.link.replace(
              ':brandId/outlet',
              ':brandId/hotel/:entityId/outlet'
            );
          }
        });
      }

      return updatedRoutes;
    }
  }

  deepCloneRoutes(routes) {
    const clonedRoutes = { ...routes };

    clonedRoutes.navRoutes = clonedRoutes.navRoutes.map((item) => {
      return this.deepCloneRoute(item);
    });

    return clonedRoutes;
  }

  deepCloneRoute(route) {
    return { ...route };
  }

  initRoutes(routeName: OutletAddRoutes | 'importService' | 'services') {
    let prefixPath = this.routesConfigService.activeRouteConfigSubscription
      .value.submodule.fullPath;

    const outletBusinessRoutesClone = JSON.parse(
      JSON.stringify(outletBusinessRoutes)
    );

    const { navRoutes, title } = this.entityId
      ? this.getRoutes(
          //edit hotel case and add hotel is in business module
          routeName,
          this.entityId ? true : false,
          this[hasId[routeName]] ? true : false
        )
      : outletBusinessRoutesClone[
          this[hasId[routeName]]
            ? correspondingEditRouteName[routeName]
            : routeName
        ];

    navRoutes.forEach((element) => {
      element.link = element.link
        .replace(':brandId', this.brandId)
        .replace(':outletId', this.outletId)
        .replace(':entityId', this.entityId)
        .replace(':menuId', this.menuId)
        .replace(':menuItemId', this.menuItemId)
        .replace(':foodPackageId', this.foodPackageId);
    });
    this.navRoutes = [...this.navRoutes, ...navRoutes];

    this.navRoutes.map((navRoute) => {
      if (!navRoute.link.includes(prefixPath)) {
        navRoute.link = prefixPath + navRoute.link;
      }
      return navRoute;
    });

    this.initNavRoutes();

    this.pageTitle = title;
  }
}
