import { Component, OnInit } from '@angular/core';
import { ConfigService, NavRouteOptions, Option } from 'libs/admin/shared/src';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { taxRoutes } from '../../constants/routes';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { TaxService } from '../../services/tax.service';
import { TaxCountryList } from '../../models/tax.model';
import { TaxFormData } from '../../types/tax';
@Component({
  selector: 'hospitality-bot-create-tax',
  templateUrl: './create-tax.component.html',
  styleUrls: ['./create-tax.component.scss'],
})
export class CreateTaxComponent implements OnInit {
  globalCountryData: TaxCountryList;
  taxId: string;
  entityId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  pageTitle = 'Create Tax';
  loading = false;
  navRoutes: NavRouteOptions;

  countries: Option[] = [];
  taxTypeList: Option[] = [];
  categoryList: Option[] = [];
  taxValueList: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private globalFilterService: GlobalFilterService,
    private taxService: TaxService
  ) {
    this.taxId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = taxRoutes[
      this.taxId ? 'editTax' : 'createTax'
    ];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getTaxCountry();
    this.initForm();
  }

  /**
   * @function initForm To initialize form and set validators
   * @returns void
   */
  initForm(): void {
    this.useForm = this.fb.group({
      country: ['', Validators.required],
      taxType: ['', Validators.required],
      category: ['', Validators.required],
      taxValue: ['', Validators.required],
    });
    this.initFormSubscription();
  }

  /**
   * @function getTax To get tax details if taxId is present
   * @returns void
   * @description If taxId is present then it will call getTaxById api to get tax details and patch value in form
   */
  getTax() {
    this.loading = true;
    this.$subscription.add(
      this.taxService
        .getTaxById(this.entityId, this.taxId)
        .subscribe((res: TaxFormData) => {
          this.useForm.get('country').setValue(res.country);
          this.useForm.get('taxType').setValue(res.taxType);
          this.useForm.get('category').setValue(res.category);
          this.useForm.get('taxValue').setValue(res.taxValue);
        }, this.handelError)
    );
  }

  /**
   * @function initFormSubscription To initialize form subscription
   */
  initFormSubscription() {
    this.useForm.get('country').valueChanges.subscribe((val) => {
      this.useForm.get('taxType').reset();
      this.useForm.get('category').reset();
      this.useForm.get('taxValue').reset();
      this.taxTypeList = this.globalCountryData?.records.find(
        (item) => item.label === val
      )?.taxType;
    });
    this.useForm.get('taxType').valueChanges.subscribe((val) => {
      this.useForm.get('category').reset();
      this.useForm.get('taxValue').reset();
      this.categoryList = this.taxTypeList?.find(
        (item) => item.label === val
      )?.categories;
    });
    this.useForm.get('category').valueChanges.subscribe((val) => {
      this.useForm.get('taxValue').reset();
      this.taxValueList = this.categoryList?.find(
        (item) => item.label?.toLowerCase() === val?.toLowerCase()
      )?.taxRate;
    });
  }

  /**
   * @function handleSubmit To submit form
   */
  handleSubmit(): void {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    const data = this.useForm.getRawValue() as TaxFormData;

    if (this.taxId) {
      this.$subscription.add(
        this.taxService
          .updateTax(this.entityId, this.taxId, data)
          .subscribe(this.handleSuccess, this.handelError)
      );
    } else {
      this.$subscription.add(
        this.taxService
          .createTax(this.entityId, data)
          .subscribe(this.handleSuccess, this.handelError)
      );
    }
  }

  /**
   * @function handleReset To reset form
   * @returns void
   */
  handleReset(): void {
    this.useForm.reset();
  }

  /**
   * @function getTaxCountry To get all tax country
   * @returns void
   */
  getTaxCountry() {
    this.taxService.getTaxCountry().subscribe(
      (res) => {
        this.globalCountryData = new TaxCountryList().deserialize(res);
        this.countries = this.globalCountryData.records;
        if (this.taxId) {
          this.getTax();
        }
      },
      this.handelError,
      this.handelFinal
    );
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.snackbarService.openSnackBarAsText(
      `Tax ${this.taxId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.router.navigate(['pages/settings/tax']);
  };

  /**
   * @function handleError To show error message
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelFinal = () => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
