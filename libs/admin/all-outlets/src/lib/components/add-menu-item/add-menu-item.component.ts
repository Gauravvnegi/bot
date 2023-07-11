import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { outletBusinessRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';
import { MenuItemForm } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';
import { PageReloadService } from '../../services/page-reload.service.service';
import { TaxService } from 'libs/admin/tax/src/lib/services/tax.service';

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
  itemId: string = '';
  mealPreferences: Option[] = [];
  types: Option[] = [];
  categories: Option[] = [];
  loading: boolean = false;
  $subscription = new Subscription();
  taxes: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private snackbarService: SnackBarService,
    route: ActivatedRoute,
    router: Router,
    private pageReloadService: PageReloadService,
    private taxService: TaxService
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.pageReloadService.enablePageReloadConfirmation();
    this.initOptions();
    this.initForm();
    this.initComponent('menuItem');
  }

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
      active: [true],
      name: ['', Validators.required],
      mealPreference: ['', Validators.required],
      category: ['', Validators.required],
      type: ['', Validators.required],
      preparationTime: ['', Validators.required],
      unit: ['', Validators.required],
      dineInPrice: ['', Validators.required],
      hsnCode: ['', Validators.required],
      tax: ['', Validators.required],
      notes: [''],
    });

    if (this.itemId) {
      this.$subscription.add(
        this.outletService.getMenuItemsById(this.itemId).subscribe((res) => {
          this.useForm.patchValue(res);
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
      this.taxService.getTaxList(this.entityId).subscribe(({ records }) => {
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
    this.router.navigate(['pages/settings/tax/create-tax']);
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Please fill all the required fields'
      );
      return;
    }

    const data = this.useForm.getRawValue() as MenuItemForm;

    if (this.itemId) {
      this.$subscription.add(
        this.outletService
          .updateMenuItems(data, this.itemId, this.menuId)
          .subscribe(this.handleError, this.handleSuccess)
      );
    } else {
      this.$subscription.add(
        this.outletService.addMenuItems(data, this.itemId).subscribe((res) => {
          this.handleSuccess(res?.id);
        }, this.handleError)
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
  handleSuccess = (id?: string) => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `MenuItem ${this.itemId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.pageReloadService.disablePageReloadConfirmation();
    this.router.navigate([id], {
      relativeTo: this.route,
    });
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
