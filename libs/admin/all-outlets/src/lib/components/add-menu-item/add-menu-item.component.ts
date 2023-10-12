import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  NavigationExtras,
  Route,
  Router,
} from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  ModuleNames,
  NavRouteOptions,
  Option,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TaxService } from 'libs/admin/tax/src/lib/services/tax.service';
import { Subscription } from 'rxjs';
import { OutletService } from '../../services/outlet.service';
import { PageReloadService } from '../../services/page-reload.service.service';
import { MenuItemForm, MenuItemResponse } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';

@Component({
  selector: 'hospitality-bot-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.scss'],
})
export class AddMenuItemComponent extends OutletBaseComponent
  implements OnInit {
  useForm: FormGroup;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';
  mealPreferences: Option[] = [];
  types: Option[] = [];
  categories: Option[] = [];
  loading: boolean = false;
  $subscription = new Subscription();
  taxes: Option[] = [];
  currencies: Option[] = [{ label: 'INR', value: 'INR' }];
  unitOptions = [
    { label: 'gm', value: 'GRAMS' },
    { label: 'piece', value: 'PIECE' },
    { label: 'litre', value: 'LITRE' },
    { label: 'kg', value: 'KILOGRAM' },
    { label: 'ml', value: 'MILLILITER' },
  ];
  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private snackbarService: SnackBarService,
    route: ActivatedRoute,
    router: Router,
    private pageReloadService: PageReloadService,
    private taxService: TaxService,
    private globalFilterService: GlobalFilterService,
    private configService: ConfigService,
    private location: Location,
    private routesConfigService: RoutesConfigService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.pageReloadService.enablePageReloadConfirmation();
    this.initOptions();
    this.initForm();
    // this.initConfig();
    this.initRoutes('menuItem');
  }

  // initConfig() {
  //   this.configService.$config.subscribe((value) => {
  //     if (value) {
  //       const { currencyConfiguration } = value;
  //       this.currencies = currencyConfiguration.map(({ key, value }) => ({
  //         label: key,
  //         value,
  //       }));
  //       this.useForm.setValue({
  //         dineInPriceCurrency: this.currencies[0].value,
  //         deliveryPriceCurrency: this.currencies[0].value,
  //       });
  //     }
  //   });
  // }

  initOptions() {
    // const menu = this.outletService.menu.value;
    this.outletService.getOutletConfig().subscribe((res) => {
      const config = res.type.filter((item) => {
        if (item.menu) return item.menu;
      });
      this.mealPreferences = config[0].menu.mealPreference.map((item) => ({
        label: item,
        value: item,
      }));
      this.types = config[0].menu.type.map((item) => ({
        label: item,
        value: item,
      }));
      this.categories = config[0].menu.category.map((item) => ({
        label: item,
        value: item,
      }));
    });
    this.getTax();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      status: [true],
      name: ['', Validators.required],
      mealPreference: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      preparationTime: ['', Validators.required],
      quantity: ['', Validators.required],
      unit: ['GRAMS'],
      dineInPriceCurrency: ['INR', [Validators.required]],
      dineInPrice: ['', [Validators.required, Validators.min(0)]],
      deliveryPriceCurrency: ['INR'],
      deliveryPrice: ['', [Validators.min(0)]],
      hsnCode: [''],
      taxIds: [[]],
      description: [''],
    });
    if (this.menuItemId) {
      this.$subscription.add(
        this.outletService
          .getMenuItemsById(this.menuItemId)
          .subscribe((res: MenuItemResponse) => {
            const { taxes, ...rest } = res;
            this.useForm.patchValue({
              ...rest,
              taxIds: taxes.map((item) => item.id),
            });
          })
      );
    }
  }

  /**
   * @function getTax to get tax options
   * @returns void
   */
  getTax() {
    this.$subscription.add(
      this.taxService
        .getTaxList(this.outletId, { params: `?entityId=${this.outletId}` })
        .subscribe(({ records }) => {
          records = records.filter(
            (item) => item.category === 'service' && item.status
          );
          this.taxes = records.map((item) => ({
            label: item.taxType + ' ' + item.taxValue + '%',
            value: item.id,
          }));
        })
    );
  }

  createTax() {
    const dataToSend = {
      entityId: this.outletId, // Replace with your actual data
    };

    const navigationExtras: NavigationExtras = {
      queryParams: dataToSend,
    };
    // this.router.navigate(['pages/settings/tax/create-tax'], navigationExtras);
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.TAX,
      additionalPath: 'create-tax',
      queryParams: dataToSend,
    });
  }

  // To be added from BE first
  createCategory(name: string) {}

  createMealPreference(name: string) {}

  createType(name: string) {}

  handleSubmit() {
    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Please fill all the required fields'
      );
      return;
    }

    const data = this.useForm.getRawValue() as MenuItemForm;
    if (this.menuItemId) {
      this.$subscription.add(
        this.outletService
          .updateMenuItems(data, this.menuItemId, this.menuId)
          .subscribe(this.handleSuccess, this.handleError)
      );
    } else {
      this.$subscription.add(
        this.outletService
          .addMenuItems(data, this.menuId, this.outletId)
          .subscribe(this.handleSuccess, this.handleError)
      );
    }
  }

  handleReset() {
    this.useForm.reset();
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Menu Item ${this.menuItemId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.pageReloadService.disablePageReloadConfirmation();
    this.location.back();
  };

  handleError = ({ err }) => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
    this.pageReloadService.disablePageReloadConfirmation();
  }
}
