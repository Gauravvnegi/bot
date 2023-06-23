import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { outletRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';
import { MenuItemForm } from '../../types/outlet';

@Component({
  selector: 'hospitality-bot-add-menu-item',
  templateUrl: './add-menu-item.component.html',
  styleUrls: ['./add-menu-item.component.scss'],
})
export class AddMenuItemComponent implements OnInit {
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
  taxes: Option[] = [
    { label: 'CGST 4%', value: 'CGST' },
    { label: 'sGST 12%', value: 'SGST' },
    { label: 'VAT 20%', value: 'VAT' },
  ];

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = false;
    return 'Are you sure you want to leave? Your unsaved changes will be lost.';
  }

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {
    const { navRoutes, title } = outletRoutes['addMenuItem1'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.initOptions();
    this.initForm();
  }

  initOptions() {
    const menu = this.outletService.menu.value;
    this.mealPreferences = menu.mealPreference.map((item) => ({
      label: item,
      value: item,
    }));
    this.types = menu.type.map((item) => ({
      label: item,
      value: item,
    }));
    this.categories = menu.category.map((item) => ({
      label: item,
      value: item,
    }));
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

  handleSubmit() {
    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Please fill all the required fields'
      );
      return;
    }

    const data = this.useForm.getRawValue() as MenuItemForm;

    if (this.itemId) {
      this.outletService
        .addMenuItems(data, {
          params:
            'menuId=4c0ca870-5e1a-4197-b5b1-b53e6c23e2c8&entityId=a1206cf8-a579-4ab9-b345-cc8ea6ca3748',
        })
        .subscribe(this.handelError, this.handelSuccess);
    } else {
      this.outletService
        .updateMenuItems(this.itemId, data)
        .subscribe(this.handelError, this.handelSuccess);
    }
  }

  handleReset() {
    this.useForm.reset();
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handelSuccess = () => {
    this.snackbarService.openSnackBarAsText(
      `MenuItem ${this.itemId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.router.navigate(['/pages/outlet/all-outlets/add-outlet/add-menu']);
  };

  handelError = ({ err }) => {
    this.loading = false;
  };
}
