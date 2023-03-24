import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CategoryFormValue, NavRouteOptions } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { servicesRoutes } from '../../constant/routes';
import { ServicesService } from '../../services/services.service';

@Component({
  selector: 'hospitality-bot-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  readonly navRoute = servicesRoutes.createCategory.navRoutes;
  readonly pageTitle = servicesRoutes.createCategory.title;

  hotelId: string;
  $subscription = new Subscription();

  constructor(
    private globalFilterService: GlobalFilterService,
    private servicesService: ServicesService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
  }

  handleSubmit(value: CategoryFormValue) {
    this.$subscription.add(
      this.servicesService
        .createCategory(this.hotelId, {
          ...value,
          type: 'SERVICE_CATEGORY',
          source: 1,
        })
        .subscribe(
          () => {
            this.snackbarService.openSnackBarAsText(
              'Category created successfully',
              '',
              { panelClass: 'success' }
            );
            this.router.navigate(['/pages/library/services']);
          },
          ({ error }) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: `messages.error.${error?.type}`,
                  priorityMessage: error?.message,
                },
                ''
              )
              .subscribe();
          }
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
