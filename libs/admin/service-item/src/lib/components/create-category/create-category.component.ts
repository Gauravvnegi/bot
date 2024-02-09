import { Component, OnInit } from '@angular/core';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  CategoryFormValue,
  NavRouteOption,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ServiceItemService } from '../../services/service-item-datatable.service';
import { ActivatedRoute } from '@angular/router';
import { parmaId, serviceItemRoutes } from '../../constants/routes';

@Component({
  selector: 'hospitality-bot-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss'],
})
export class CreateCategoryComponent implements OnInit {
  navRoutes: NavRouteOption[] = [];
  pageTitle: string = 'Create Category';
  entityId: string;
  $subscription = new Subscription();
  categoryId: string;
  formData;
  loading: boolean = false;

  constructor(
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private routesConfigService: RoutesConfigService,
    private serviceItemsServices: ServiceItemService,
    private route: ActivatedRoute
  ) {
    this.categoryId = this.route.snapshot.paramMap.get(parmaId.editCategory);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    const { navRoutes, title } = this.categoryId
      ? serviceItemRoutes.editCategory
      : serviceItemRoutes.createCategory;
    this.navRoutes = navRoutes;
    this.pageTitle = title;
    this.initNavRoutes();
  }

  ngAfterViewInit(): void {
    if (this.categoryId) {
      this.getCategoryDetails();
    }
  }
  getCategoryDetails() {
    this.serviceItemsServices
      .getCategoryById(this.entityId, this.categoryId)
      .subscribe((res) => {
        this.formData = {
          name: res?.name,
          description: res?.description,
          imageUrl: res?.imageUrl[0],
          active: res?.active,
        };
      });
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  handleSubmit(value: CategoryFormValue) {
    const { imageUrl, ...rest } = value;

    if (this.categoryId) {
      this.$subscription.add(
        this.serviceItemsServices
          .updateCategory(this.entityId, this.categoryId, {
            ...rest,
            imageUrl: [imageUrl],
          })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    } else {
      this.$subscription.add(
        this.serviceItemsServices
          .createCategory(this.entityId, {
            ...rest,
            imageUrl: [imageUrl],
          })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    }
  }

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      this.categoryId
        ? 'Category Updated successfully'
        : `Category Created successfully`,
      '',
      { panelClass: 'success' }
    );

    this.routesConfigService.goBack();
  };

  handleError = (error) => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
