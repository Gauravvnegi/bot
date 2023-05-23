import { Component, OnInit, ViewChild } from '@angular/core';
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
  SegmentList,
  ServiceIdList,
  Services,
  noRecordAction,
} from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { AddressService } from '../../services/place.service';

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
  addressList: any[] = [];
  google: any;
  options = {
    types: [],
    componentRestrictions: { country: 'IN' },
  };
  prevAddressId: string;
  constructor(
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private router: Router,
    private businessService: BusinessService,
    private addressService: AddressService,
    private route: ActivatedRoute
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
    this.initForm();
    this.getServices();
    this.getSegmentList();
  }

  initForm() {
    this.useForm = this.fb.group({
      hotel: this.fb.group({
        status: [true],
        name: ['', [Validators.required]],
        propertyCategory: ['', [Validators.required]],
        emailId: ['', [Validators.required, Validators.email]],
        contact: this.fb.group({
          countryCode: [''],
          number: [''],
        }),
        address: [[], [Validators.required]],
        imageUrl: [[], [Validators.required]],
        description: ['', [Validators.required]],
        serviceIds: [[]],
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
        const { address, ...rest } = res;
        this.prevAddressId = address?.id;

        this.addressList = [
          {
            label: address?.formattedAddress,
            value: address?.id,
          },
        ];
        const data = new HotelResponse().deserialize(rest);
        this.useForm.patchValue(data);
        this.useForm
          .get('hotel.address')
          .setValue({ label: address?.formattedAddress, value: address?.id });
      });
    }
  }

  /**
   * @function addMoreImage to add more image
   * @returns void
   */
  addMoreImage() {
    this.imageLimit = this.imageLimit + 4;
  }

  /**
   * @function getSegmentList to get segment list
   * @returns void
   * @description to get segment list
   */

  getSegmentList() {
    this.businessService.getSegments().subscribe((res) => {
      this.segmentList = new SegmentList().deserialize(res).segmentList;
    });
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices() {
    if (!this.hotelId) {
      this.$subscription.add(
        this.businessService.getServices().subscribe(
          (res) => {
            this.compServices = new Services().deserialize(
              res.service
            ).services;
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
          }
        )
      );
    } else {
      this.businessService.getServiceList(this.hotelId).subscribe((res) => {
        this.compServices = res.services;
        const serviceIds = new ServiceIdList().deserialize(res).serviceIdList;
        this.useForm.get('hotel.serviceIds').patchValue(serviceIds);
      });
    }
  }

  saveHotelData() {
    this.businessService.initHotelInfoFormData(
      this.useForm.getRawValue().hotel
    );
    this.router.navigate(['services'], { relativeTo: this.route });
  }

  /**
   * @function submitForm to submit form
   * @returns void
   * @description to submit form
   */
  async submitForm() {
    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.useForm.markAllAsTouched();
      return;
    }
    this.businessService.onSubmit.emit(true);
    const data = this.useForm.getRawValue();

    data.hotel.propertyCategory = this.segmentList.find(
      (item) => item?.value === data.hotel.propertyCategory
    );

    try {
      const address = await this.addressService.getAddressById(
        data.hotel.address?.value,
        this.prevAddressId === data.hotel.address?.value
      );

      data.hotel.address = address;

      if (this.hotelId) {
        this.$subscription.add(
          this.businessService.updateHotel(this.hotelId, data.hotel).subscribe(
            (res) => {
              this.router.navigate([
                `/pages/settings/business-info/brand/${this.brandId}`,
              ]);
            },
            this.handelError,
            this.handleSuccess
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
            this.handelError,
            this.handleSuccess
          )
        );
      }
    } catch (error) {
      // Handle the error from getAddressById function
      this.handelError(error);
    }
  }

  resetForm() {
    this.useForm.reset({}, { emitEvent: true });
  }

  searchOptions(text: string) {
    if (text) {
      var placeServiceRequest = {
        input: text,
        types: ['establishment'],
      };
      var service = new google.maps.places.AutocompleteService();
      service.getPlacePredictions(
        placeServiceRequest,
        (predictions, status) => {
          if (status == google.maps.places.PlacesServiceStatus.OK) {
            this.addressList = predictions.map((item) => {
              return {
                label: item.description,
                value: item.place_id,
              };
            });
          }
        }
      );
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
