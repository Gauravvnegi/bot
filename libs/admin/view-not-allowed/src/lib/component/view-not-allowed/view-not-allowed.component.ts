import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  RouteConfigPathService,
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { environment } from '@hospitality-bot/admin/environment';
import { ProductNames } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-view-not-allowed',
  templateUrl: './view-not-allowed.component.html',
  styleUrls: ['./view-not-allowed.component.scss'],
})
export class ViewNotAllowedComponent implements OnInit {
  products: ProductOption[] = [];
  constructor(
    private subscriptionPlanService: SubscriptionPlanService,
    private router: Router
  ) {}

  redirectToHomePage(): void {
    window.open(environment.guest_home, '_blank');
  }

  ngOnInit(): void {
    const products = new Array<ProductOption>();
    this.subscriptionPlanService.getSubscription().products.forEach((item) => {
      if (this.checkPermission(item.name) && item.isSubscribed && item.isView) {
        products.push({
          label: item.label,
          name: item.name,
          icon: item.icon,
        });
      }
    });

    this.products = products;
  }

  navigate(name: ProductNames) {
    const routeService = new RouteConfigPathService();
    this.router.navigate([routeService.getRouteFromName(name)]);
  }

  checkPermission(name: ProductNames) {
    return this.subscriptionPlanService.hasViewUserPermission({
      type: 'product',
      name,
    });
  }
}

type ProductOption = { label: string; name: ProductNames; icon: string };
