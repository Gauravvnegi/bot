import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRouteSnapshot,
  Router
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
import { BusinessService } from '../../services/business.service';

declare let google: any;


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
  options = {
    types: [],
    componentRestrictions: { country: 'IN' },
  };
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private router: Router,
    private businessService: BusinessService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const hotelId = snapshot?.params['hotelId'];
        const brandId = snapshot?.params['brandId'];
        if (hotelId) this.hotelId = hotelId;
        if (brandId) this.brandId = brandId;
      }
    );
   
  }

  ngOnInit(): void {
    // this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
    this.getSegmentList();
    this.getServices();
    // this.getPlaceAutocomplete();
    this.loadGoogleMaps();
  }

  initForm() {
    this.useForm = this.fb.group({
      hotel: this.fb.group({
        active: [true],
        name: ['', [Validators.required]],
        segment: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        contactInfo: this.fb.group({
          cc: [''],
          phoneNumber: [''],
        }),
        address: this.fb.group({
          address: [[]],
        }),

        imageUrls: [[], [Validators.required]],
        description: ['', [Validators.required]],
        complimentaryAmenities: [[]],
        socialPlatforms: [[]],
      }),
      brandId: [this.brandId],
    });

     const { navRoutes, title } = businessRoute[
       this.hotelId ? 'editHotel' : 'hotel'
     ];
     this.pageTitle = title;
     this.navRoutes = navRoutes;
    this.navRoutes[2].link = `/pages/settings/business-info/brand/${this.brandId}`;

    if (this.hotelId) {
      this.businessService.getHotelById(this.hotelId).subscribe((res) => {
        const data = new HotelResponse().deserialize(res);
        this.useForm.patchValue(data);
      });
    }
  }

  saveHotelData() {}

  addMoreImage() {
    this.imageLimit = this.imageLimit + 4;
  }

  getSegmentList() {
    this.businessService.getSegments(this.hotelId).subscribe((res) => {
      this.segmentList = res.category;
    });
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices() {
    this.$subscription.add(
      this.businessService
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
    this.loading = true;
    if (this.useForm.invalid) {
      console.log(this.useForm.errors);
      this.loading = false;
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.useForm.markAllAsTouched();
      return;
    }

    this.businessService.onSubmit.emit(true);
    const data = this.useForm.getRawValue();

    if (this.hotelId) {
      this.$subscription.add(
        this.businessService.updateHotel(this.hotelId, data.hotel).subscribe(
          (res) => {
            this.router.navigate([
              `/pages/settings/business-info/brand/${this.brandId}`,
            ]);
          },

          this.handelError
        )
      );
    } else {
      this.$subscription.add(
        this.businessService.createHotel(this.brandId, data).subscribe(
          (res) => {
            this.router.navigate([
              `/pages/settings/business-info/brand/${this.brandId}`,
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
  @ViewChild('addresstext') addresstext: any;

  // searchOptions(text: string) {
  //   if (text) {
  //     const autocomplete = new google.maps.places.Autocomplete({
  //       india: 'IN',
  //       componentRestrictions: { country: 'US' },
  //       types: ['establishment'], // 'establishment' / 'address' / 'geocode'
  //     });

  //     console.log(autocomplete);
  //   }
  // }

  // private getPlaceAutocomplete() {
  //   const autocomplete = new google.maps.places.Autocomplete(
  //     this.addresstext.nativeElement,
  //     {
  //       componentRestrictions: { country: 'US' },
  //       types: ['establishment'], // 'establishment' / 'address' / 'geocode'
  //     }
  //   );
  //   google.maps.event.addListener(autocomplete, 'place_changed', () => {
  //     const place = autocomplete.getPlace();
  //     console.log(place);
  //     // this.invokeEvent(place);
  //   });
  // }
  google: any;
  autocomplete: any;
  private loadGoogleMaps() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC42YgNcCSadoy8dxDKKEXZohJU9B5eM2M&libraries=places`;
    script.defer = true;
    script.async = true;
    script.onload = () => {
      this.google = window['google'];
      this.initAutocomplete();
    };
    document.head.appendChild(script);
  }

  private initAutocomplete() {
    this.autocomplete = new this.google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      { types: ['geocode'] }
    );

    this.autocomplete.addListener('place_changed', () => {
      const place = this.autocomplete.getPlace();
      this.useForm.patchValue({
        hotel: {
          address: {
            address: place.formatted_address,
          }
        }
      });
    });
  }

  searchOptions(text: string) {
    if (text) {
      this.initAutocomplete();
    }
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
  handleAddressChange(address: any) {
    console.log(address);
  }

  /**
   * @function handelFinal To handel loading
   * @param param0  network error
   */
  handelError = ({ error }): void => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
