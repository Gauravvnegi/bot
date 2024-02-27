import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ModuleNames,
  NavRouteOption,
  Option,
} from '@hospitality-bot/admin/shared';
import { parmaId, serviceItemRoutes } from '../../constants/routes';
import { convertToNormalCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';
import { ServiceItemService } from '../../services/service-item-datatable.service';
import { Subscription } from 'rxjs';
import { RoutesConfigService } from 'apps/admin/src/app/core/theme/src/lib/services/routes-config.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { ServiceItemFormData } from '../../models/create-service-item.model';

@Component({
  selector: 'hospitality-bot-create-service-item',
  templateUrl: './create-service-item.component.html',
  styleUrls: ['./create-service-item.component.scss'],
})
export class CreateServiceItemComponent implements OnInit {
  useForm: FormGroup;
  userList: Option[];
  loading: boolean = false;
  pageTitle: string = 'Create Service Item';
  navRoutes: NavRouteOption[] = [];
  serviceItemId: string;
  entityId: string;
  $subscription = new Subscription();
  categoryList: Option[] = [];
  isSidebar: boolean = false;
  @Output() onCloseSidebar = new EventEmitter<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private routesConfigService: RoutesConfigService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private managePermissionService: ManagePermissionService,
    private serviceItemService: ServiceItemService
  ) {
    this.serviceItemId = this.route.snapshot.paramMap.get(
      parmaId.editServiceItem
    );
    const { navRoutes, title } = this.serviceItemId
      ? serviceItemRoutes.editServiceItem
      : serviceItemRoutes.createServiceItem;
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.initNavRoutes();
    this.initOptions();
  }

  initOptions(): void {
    this.getUserList();
    this.getCategoryList();
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  initForm() {
    this.useForm = this.fb.group({
      active: [true],
      itemName: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      sla: ['', [Validators.required]],
      users: ['', [Validators.required]],
      remarks: [''],
    });

    if (this.serviceItemId) {
      this.getServiceItemDetails();
    }
  }

  getServiceItemDetails() {
    this.$subscription.add(
      this.serviceItemService
        .getServiceItemById(this.entityId, this.serviceItemId)
        .subscribe((res) => {
          this.useForm.patchValue(new ServiceItemFormData().deserialize(res));
        })
    );
  }

  getUserList() {
    this.$subscription.add(
      this.managePermissionService
        .getAllUsers(this.entityId, {
          params: '?mention=true',
        })
        .subscribe((data) => {
          this.userList = data.users.map((item) => ({
            label: `${item.firstName} ${item.lastName}`,
            value: item.id,
            extras: item?.departments
              .map((item) => convertToNormalCase(item.department))
              .join(', '),
          }));
        })
    );
  }
  getCategoryList() {
    this.$subscription.add(
      this.serviceItemService
        .getCategoryList(this.entityId, { params: '?limit=0&offset=0' })
        .subscribe((res) => {
          this.categoryList = res.records.map((item) => {
            return {
              label: item?.name,
              value: item?.id,
            };
          });
        })
    );
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }
    let { sla, ...rest } = this.useForm.getRawValue();
    sla = sla / (1000 * 60);

    this.loading = true;

    if (this.serviceItemId) {
      this.$subscription.add(
        this.serviceItemService
          .updateServiceItem(this.entityId, this.serviceItemId, {
            ...rest,
            sla,
          })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    } else {
      this.$subscription.add(
        this.serviceItemService
          .createServiceItem(this.entityId, { ...rest, sla })
          .subscribe(this.handleSuccess, this.handleError, this.handleFinal)
      );
    }
  }

  close() {
    if (this.isSidebar) {
      this.closeSidebar();
    } else {
      this.routesConfigService.goBack();
    }
  }

  createCategory(categoryName: string) {
    if (this.isSidebar) {
      this.serviceItemService
        .createCategory(this.entityId, {
          name: categoryName,
          active: true,
        })
        .subscribe(
          (res) => {
            this.categoryList.push({
              label: res?.name,
              value: res?.id,
            });
            this.useForm.get('categoryId').setValue(res.id);
            this.snackbarService.openSnackBarAsText(
              'Category created successfully',
              '',
              { panelClass: 'success' }
            );
          },
          () => {}
        );
    } else {
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.SERVICE_ITEM,
        additionalPath: `${serviceItemRoutes.manageCategory.route}/${serviceItemRoutes.createCategory.route}`,
      });
    }
  }

  closeSidebar() {
    this.onCloseSidebar.emit();
  }

  handleSuccess = (res) => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      this.serviceItemId
        ? 'Service Updated successfully'
        : `Service Created successfully`,
      '',
      { panelClass: 'success' }
    );

    if (this.isSidebar) {
      this.onCloseSidebar.emit(res);
    } else {
      this.routesConfigService.goBack();
    }
  };

  handleError = (error) => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  resetForm() {
    this.useForm.reset();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
