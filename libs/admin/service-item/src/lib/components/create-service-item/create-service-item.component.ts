import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  ModuleNames,
  NavRouteOption,
  Option,
} from '@hospitality-bot/admin/shared';
import { parmaId, serviceItemRoutes } from '../../constants/routes';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { convertToNormalCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ManagePermissionService } from 'libs/admin/roles-and-permissions/src/lib/services/manage-permission.service';
import { ServiceItemService } from '../../services/service-item-datatable.service';
import { Subscription } from 'rxjs';

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
      itemName: ['', [Validators.required]],
      categoryId: ['', [Validators.required]],
      sla: ['', [Validators.required]],
      users: ['', [Validators.required]],
      remarks: ['', Validators.required],
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
          let { sla, ...rest } = res;
          //convert sla into milliseconds
          this.useForm.patchValue({ ...res, sla });
        })
    );
  }

  getUserList() {
    this.$subscription.add(
      this.managePermissionService
        .getAllUsers(this.entityId, {
          params: '?status=true&mention=true',
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
          .updateLibraryItem(this.entityId, this.serviceItemId, {
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

  close() {}

  create() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.SERVICE_ITEM,
      additionalPath: serviceItemRoutes.createCategory.route,
    });
  }

  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      this.serviceItemId
        ? 'Service Updated successfully'
        : `Service Created successfully`,
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

  resetForm() {
    this.useForm.reset();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
