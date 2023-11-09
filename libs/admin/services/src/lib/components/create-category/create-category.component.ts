import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CategoryFormValue, NavRouteOptions } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { servicesRoutes } from '../../constant/routes';
import { ServicesService } from '../../services/services.service';
import { ImageUrl } from 'libs/admin/room/src/lib/types/service-response';

@Component({
  selector: 'hospitality-bot-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  readonly navRoute = servicesRoutes.createCategory.navRoutes;
  readonly pageTitle = servicesRoutes.createCategory.title;
  paramData: any;

  entityId: string;
  $subscription = new Subscription();

  constructor(
    private globalFilterService: GlobalFilterService,
    private servicesService: ServicesService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.paramData = this.route.snapshot.queryParams;
    this.entityId = this.paramData?.entityId;
  }

  handleSubmit(value: CategoryFormValue) {
    const imageUrls = [{ isFeatured: true, url: value.imageUrl }];
    this.$subscription.add(
      this.servicesService
        .createCategory(this.entityId, {
          ...value,
          type: 'SERVICE_CATEGORY',
          source: 1,
          imageUrl: imageUrls,
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

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
