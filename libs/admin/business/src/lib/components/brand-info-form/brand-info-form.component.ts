import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute, Router } from '@angular/router';
import { BrandService } from '../../services/brand.service';
import { businessRoute } from '../../constant/routes';
import {
  HotelDetailService,
  NavRouteOptions,
} from '@hospitality-bot/admin/shared';
import { BrandFormData } from '../../models/brand.model';

@Component({
  selector: 'hospitality-bot-brand-info-form',
  templateUrl: './brand-info-form.component.html',
  styleUrls: ['./brand-info-form.component.scss'],
})
export class BrandInfoFormComponent implements OnInit {
  pageTitle: string = 'Create Brand';
  code: string = '#8544556CY';
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
    private brandService: BrandService,
    private route: ActivatedRoute,
    private router: Router,
    private hotelDetailService: HotelDetailService
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
  }

  initForm(): void {
    this.useForm = this.fb.group({
      active: [true],
      name: [''],
      description: [''],
      facebook: [''],
      twitter: [''],
      instagram: [''],
      youtube: [''],
    });
  }

  handleSubmit() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    const data = new BrandFormData().deserialize(
      this.useForm.getRawValue(),
      this.siteId
    );
    this.$subscription.add(
      this.brandService.createBrand(data).subscribe((res) => {
        this.handleSuccess();
        this.router.navigate([`pages/settings/business-info/brand/${res.id}`]);
      }, this.handelError)
    );
  }
  handleReset() {
    this.useForm.reset();
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.isBrandCreated = true;
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
}
