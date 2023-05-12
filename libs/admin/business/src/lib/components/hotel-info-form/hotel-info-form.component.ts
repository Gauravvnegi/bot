import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOption, Option } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { businessRoute } from '../../constant/routes';
import {
  HotelResponse,
  Services,
  noRecordAction,
} from '../../models/hotel.models';
import { HotelService } from '../../services/hotel.service';
import { BrandService } from '../../services/brand.service';
import { SocialMediaService } from '../../services/social-media.service';
import { HotelFormData } from '../../types/hotel.type';

@Component({
  selector: 'hospitality-bot-hotel-info-form',
  templateUrl: './hotel-info-form.component.html',
  styleUrls: ['./hotel-info-form.component.scss'],
})
export class HotelInfoFormComponent implements OnInit {
  hotelId: string;
  useForm: FormGroup;
  compServices = [];
  loading = false;
  imageLimit: number = 4;
  segmentList: Option[];
  $subscription = new Subscription();
  navRoutes: NavRouteOption[];
  pageTitle: string = 'Hotel';
  brandId: string;
  noRecordAction = noRecordAction;
  constructor(
    private fb: FormBuilder,
    private hotelService: HotelService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private router: Router,
    private socialMediaService: SocialMediaService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const hotelId = snapshot?.params['hotelId'];
        const brandId = snapshot?.params['brandId'];
        if (hotelId) this.hotelId = hotelId;
        if (brandId) this.brandId = brandId;
      }
    );
    const { navRoutes, title } = businessRoute[
      this.hotelId ? 'editHotel' : 'hotel'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  ngOnInit(): void {
    // this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
    this.getSegmentList();
    this.getServices();
  }

  initForm() {
    this.useForm = this.fb.group({
      hotel: this.fb.group({
        active: [true],
        serviceName: ['', [Validators.required]],
        segment: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        contact: ['', [Validators.required]],
        address: ['', [Validators.required]],
        imageUrls: [[], [Validators.required]],
        description: ['', [Validators.required]],
        complimentaryAmenities: [[]],
        socialPlatForms: [[]],
      }),
      brandId: [this.brandId],
    });
    this.navRoutes[2].link = `/pages/settings/business-info/brand/${this.brandId}`;

    if (this.hotelId) {
      this.hotelService.getHotelById(this.hotelId).subscribe((res) => {
        const data = new HotelResponse().deserialize(res);
        console.log(data);

        this.useForm.patchValue(data);
      });
    }
  }

  saveHotelData() {}

  addMoreImage() {
    this.imageLimit = this.imageLimit + 4;
  }

  getSegmentList() {
    this.hotelService.getSegments(this.hotelId).subscribe((res) => {
      this.segmentList = res;
    });
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices() {
    this.$subscription.add(
      this.hotelService
        .getServices(this.hotelId, {
          params: `?limit=5&type=SERVICE&serviceType=COMPLIMENTARY&status=true`,
        })
        .subscribe(
          (res) => {
            this.compServices = new Services().deserialize(
              res.complimentaryPackages
            ).services;
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
          }
        )
    );
  }

  submitForm() {
    if (this.useForm.invalid) {
      console.log(this.useForm.errors);
      this.loading = false;
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.useForm.markAllAsTouched();
      return;
    }
    this.socialMediaService.onSubmit.emit(true);
    // const data = this.useForm.getRawValue() as HotelFormData;
    const data = {
      hotel: {
        name: 'hotel Reddwe',
        logo:
          'https://nyc3.digitaloceanspaces.com/botfiles/bot/bot/hotel/logos/static-content/hilltop/hiltop-logo2.png',
        timezone: 'Asia/Calcutta',
        segment: 'hotel',
        address: {
          city: 'Noida',
          country: 'India',
          latitude: 0.0,
          longitude: 0.0,
          pincode: 0,
        },
        contactInfo: {},
      },
      brandId: '27770ecf-5d89-477b-a9cb-81616a648f17',
    };

    if (this.hotelId) {
      this.$subscription.add(
        this.hotelService.updateHotel(this.hotelId, data).subscribe(
          (res) => {
            this.handleSuccess;
            this.router.navigate([
              `/pages/settings/business-info/brand/${this.brandId}/hotel`,
            ]);
          },

          this.handelError
        )
      );
    } else {
      this.$subscription.add(
        this.hotelService.createHotel(this.brandId, data).subscribe(
          (res) => {
            this.handleSuccess;
            this.router.navigate([
              `/pages/settings/business-info/brand/${this.brandId}/hotel/${res.id}`,
            ]);
          },

          this.handelError
        )
      );
    }
  }

  resetForm() {
    this.useForm.reset({}, { emitEvent: true });
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.snackbarService.openSnackBarAsText(
      `Hotel ${this.hotelId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
  };

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };
}
