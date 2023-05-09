import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { BrandService } from '../services/brand.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'hospitality-bot-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.scss'],
})
export class BrandComponent implements OnInit {
  pageTitle: string = 'Create Brand';
  code: string = '#8544556CY';
  useForm: FormGroup;
  $subscription = new Subscription();
  hotelId: string;
  loading: boolean = false;
  brandId: string;
  isBrandCreated: boolean = false;
  // navRoutes: string = '/pages/settings/brand';

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private brandService: BrandService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.brandId = this.route.snapshot.params['id'];
    this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      active: [''],
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

    const data = {
      brand: {
        name: 'Brand Red',
        logo:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/bot/hotel/logos/static-content/hilltop/hiltop-logo2.png',
        address: {
          latitude: 0.0,
          longitude: 0.0,
          pincode: 0,
        },
      },
    };
    this.$subscription.add(
      this.brandService
        .createBrand(this.hotelId, data)
        .subscribe(this.handleSuccess , this.handelError)
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
      `Tax ${this.brandId ? 'edited' : 'created'} successfully`,
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
