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
  defaultImage: string = 'assets/images/image-upload.png';

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
        propertyCategory: [''],
        emailId: [''],
        contact: this.fb.group({
          countryCode: [''],
          number: [''],
        }),
        gstNumber: [''],
        address: [[]],
        imageUrl: [[]],
        description: [''],
        serviceIds: [[]],
        socialPlatforms: [[]],
      }),
      brandId: [this.brandId],
    });

    // this.useForm.get('hotel.address').patchValue([
    //   {
    //     buildingName: '',
    //     city: 'Noida',
    //     country: 'India',
    //     floor: '',
    //     formattedAddress:
    //       'H9G4+8WH, Morna, Sector 35, Noida, Uttar Pradesh 201307, India',
    //     latitude: 28.5759152,
    //     longitude: 77.35734479999999,
    //     id: 'ChIJNQGuDmHlDDkR7gG7SGkbpSM',
    //     postalCode: '201307',
    //     sector: 'Sector 35',
    //     state: 'Uttar Pradesh',
    //     street: '',
    //   },
    // ]);

    const { navRoutes, title } = businessRoute[
      this.hotelId ? 'editHotel' : 'hotel'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.navRoutes[2].link = `/pages/settings/business-info/brand/${this.brandId}`;
    this.navRoutes[2].isDisabled = !this.brandId;
    this.navRoutes[3].isDisabled = true;

    // if hotel form state is true then set form data
    if (this.businessService.hotelFormState) {
      this.prevAddressId = this.businessService.hotelInfoFormData!.address.value;
      this.useForm
        .get('hotel')
        .patchValue(this.businessService.hotelInfoFormData);
    }

    if (this.hotelId && !this.businessService.hotelFormState) {
      this.businessService.getHotelById(this.hotelId).subscribe((res) => {
        // const data = new HotelResponse().deserialize(res);

        const { address, ...rest } = res;
        this.useForm.get('hotel').patchValue(rest);
        console.log('res', address);
        this.useForm.get('hotel.address').patchValue(address);

        this.businessService.getServiceList(this.hotelId).subscribe((res) => {
          const serviceIds = new ServiceIdList().deserialize(res).serviceIdList;
          this.useForm.get('hotel.serviceIds').patchValue(serviceIds);
        });
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
    this.$subscription.add(
      this.businessService.getServices().subscribe((res) => {
        this.compServices = new Services()
          .deserialize(res.service)
          .services.slice(0, 5);
      }, this.handelError)
    );
  }

  saveHotelData() {
    this.businessService.initHotelInfoFormData(
      this.useForm.getRawValue().hotel,
      true
    );
    if (this.hotelId) {
      this.router.navigate([
        `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.hotelId}/services`,
      ]);
    } else {
      this.router.navigate([
        `pages/settings/business-info/brand/${this.brandId}/hotel/services`,
      ]);
    }
  }

  /**
   * @function submitForm to submit form
   * @returns void
   * @description to submit form
   */
  submitForm() {
    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Invalid Form: Please fix the errors'
      );
      this.useForm.markAllAsTouched();
      return;
    }
    this.businessService.onSubmit.emit(true);
    const data = this.useForm.getRawValue();
    // get modified segment
    data.hotel.propertyCategory = this.segmentList.find(
      (item) => item?.value === data.hotel.propertyCategory
    );

    //if hotelId is present then update hotel else create hotel
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

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
