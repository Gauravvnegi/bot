import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CategoryFormValue, NavRouteOptions } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { PackagesService } from '../../services/packages.service';
import { packagesRoutes } from '../../constant/routes';

@Component({
  selector: 'hospitality-bot-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  entityId: string;

  $subscription = new Subscription();

  navRoutes: NavRouteOptions = [];

  constructor(
    private globalFilterService: GlobalFilterService,
    private packagesService: PackagesService,
    private snackbarService: SnackBarService,
    private router: Router,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initNavRoutes();
  }

  handleSubmit(value: CategoryFormValue) {
    this.$subscription.add(
      this.packagesService
        .createCategory(this.entityId, {
          ...value,
          source: 1,
          type: 'PACKAGE_CATEGORY',
        })
        .subscribe(
          () => {
            this.snackbarService.openSnackBarAsText(
              'Category created successfully',
              '',
              { panelClass: 'success' }
            );
            this.routesConfigService.goBack();
          },
          ({ error }) => {}
        )
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [
        ...navRoutesRes,
        ...packagesRoutes.createCategory.navRoutes,
      ];
    });
  }

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
