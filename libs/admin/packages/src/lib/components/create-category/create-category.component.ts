import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { CategoryFormValue, NavRouteOptions } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { PackagesService } from '../../services/packages.service';

@Component({
  selector: 'hospitality-bot-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  hotelId: string;

  $subscription = new Subscription();

  routes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Packages', link: '/pages/library/packages' },
    { label: 'Create Category', link: './' },
  ];

  constructor(
    private globalFilterService: GlobalFilterService,
    private packagesService: PackagesService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
  }

  handleSubmit(value: CategoryFormValue) {
    this.$subscription.add(
      this.packagesService
        .createCategory(this.hotelId, {
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
            this.router.navigate(['/pages/library/packages']);
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
