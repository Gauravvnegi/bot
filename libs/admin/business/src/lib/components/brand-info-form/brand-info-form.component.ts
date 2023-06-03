import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  HotelDetailService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { businessRoute } from '../../constant/routes';
import { BrandResponse } from '../../models/brand.model';
import { BusinessService } from '../../services/business.service';
import { BrandFormData } from '../../types/brand.type';
import { HotelFormDataServcie } from '../../services/hotel-form.service';

@Component({
  selector: 'hospitality-bot-brand-info-form',
  templateUrl: './brand-info-form.component.html',
  styleUrls: ['./brand-info-form.component.scss'],
})
export class BrandInfoFormComponent implements OnInit {
  pageTitle: string = 'Create Brand';
  code: string = '# will be auto generated';
  useForm: FormGroup;
  $subscription = new Subscription();
  hotelId: string;
  loading: boolean = false;
  brandId: string = '';
  isBrandCreated: boolean = false;
  navRoutes: NavRouteOptions;
  siteId: string;
  // navRoutes: string = '/pages/settings/brand';

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private hotelDetailService: HotelDetailService,
    private businessService: BusinessService,
    private hotelFormDataServcie: HotelFormDataServcie
  ) {
    this.brandId = this.route.snapshot.paramMap.get('brandId');
    const { navRoutes, title } = businessRoute[
      this.brandId ? 'editBrand' : 'brand'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.siteId = this.hotelDetailService.siteId;
    this.initForm();
    this.hotelFormDataServcie.hotelFormState = false;
  }

  socialPLatform: any;

  initForm(): void {
    this.useForm = this.fb.group({
      brand: this.fb.group({
        status: [true],
        name: ['', Validators.required],
        gstNumber: [''],
        fssaiNumber: [''],
        description: [''],
        socialPlatforms: [[]],
      }),
      siteId: [this.siteId],
    });

    //patch value
    if (this.brandId) {
      this.loading = true;
      this.$subscription.add(
        this.businessService.getBrandById(this.brandId).subscribe((res) => {
          this.useForm.get('brand').patchValue(res);
          this.code = res.brandCode;
        }, this.handelError)
      );
    }
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    this.businessService.onSubmit.emit(true);
    const data = this.useForm.getRawValue() as BrandFormData;

    if (this.brandId) {
      this.$subscription.add(
        this.businessService.updateBrand(this.brandId, data.brand).subscribe(
          (res) => {
            this.useForm.get('brand').patchValue(res);
          },
          this.handelError,
          this.handleSuccess
        )
      );
    } else {
      this.$subscription.add(
        this.businessService.createBrand(data).subscribe(
          (res) => {
            this.handleSuccess();
            this.router.navigate([
              `pages/settings/business-info/brand/${res.id}`,
            ]);
          },
          this.handelError,
          this.handleSuccess
        )
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
    this.snackbarService.openSnackBarAsText(
      `Brand ${this.brandId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.isBrandCreated = true;
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelFinal = () => {
    this.loading = false;
  };

  /**
   * @function handleError To show error message
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
