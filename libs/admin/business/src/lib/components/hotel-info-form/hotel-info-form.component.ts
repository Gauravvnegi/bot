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
  Service,
  ServiceIdList,
  Services,
  noRecordAction,
} from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { AddressService } from '../../services/place.service';
import { ServcieStatusList } from '../../models/hotel-form.model';
import { HotelFormDataService } from '../../services/hotel-form.service';

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
  addressList: any[] = [];
  allServices: Service[] = [];
  defaultImage: string = 'assets/images/image-upload.png';
  actlink: string;
  noRecordAction;

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
    private route: ActivatedRoute,
    private hotelFormDataService: HotelFormDataService
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

    if (this.hotelFormDataService.hotelFormState) {
      this.allServices = this.hotelFormDataService.hotelInfoFormData.services.map(
        (service) => service.id
      );

      this.compServices = this.hotelFormDataService.hotelInfoFormData.services.slice(
        0,
        5
      );
      this.useForm
        .get('hotel')
        .patchValue(this.hotelFormDataService.hotelInfoFormData);
    }

    this.patchValue();
    this.manageRoutes();

    //if hotel id is present then get the hotel by id and paatch the hotel detais
    if (this.hotelId && !this.hotelFormDataService.hotelFormState) {
      this.businessService.getHotelById(this.hotelId).subscribe((res) => {
        // const data = new HotelResponse().deserialize(res);

        const { address, ...rest } = res;
        this.useForm.get('hotel').patchValue(rest);
        this.useForm.get('hotel.address').patchValue(address);
      });

      //get the servcie list after getting hotel by id
      this.businessService
        .getServiceList(this.hotelId, {
          params: '?type=SERVICE&serviceType=COMPLIMENTARY&pagination=false',
        })
        .subscribe((res) => {
          this.allServices = res.complimentaryPackages.map((item) => item.id);

          this.compServices = res.complimentaryPackages.slice(0, 5);

          this.hotelFormDataService.initHotelInfoFormData(
            { services: this.compServices },
            true
          );

          const data = res.complimentaryPackages
            .filter((item) => item.active)
            .map((item) => item.id);

          this.useForm.get('hotel.serviceIds').patchValue(data);
        });
    }
  }

  manageRoutes() {
    const { navRoutes, title } = businessRoute[
      this.hotelId ? 'editHotel' : 'hotel'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.navRoutes[2].link = `/pages/settings/business-info/brand/${this.brandId}`;
    this.navRoutes[2].isDisabled = !this.brandId;
    this.navRoutes[3].isDisabled = true;
    this.noRecordAction = {
      imageSrc: 'assets/images/empty-table-service.png',
      description: 'No services found',
      actionName: '+ Import Services',
      link: this.hotelId
        ? `pages/settings/business-info/brand/${this.brandId}/hotel/${this.hotelId}/import-services`
        : `pages/settings/business-info/brand/${this.brandId}/hotel/import-services`,
    };
  }

  // if hotel form state is true then set the form value
  patchValue() {}

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

  getModifiedData(data) {
    // get modified segment
    data.hotel.propertyCategory = this.segmentList.find(
      (item) => item?.value === data.hotel.propertyCategory
    );

    // get modified address
    data.hotel.address = this.addressService.storeData;

    return data;
  }

  //to view all the services
  saveHotelData() {
    this.businessService.onSubmit.emit(true);

    //saving the hotel data locally
    this.hotelFormDataService.initHotelInfoFormData(
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

  //to import the services
  openImportService() {
    this.businessService.onSubmit.emit(true);
    const data = this.useForm.getRawValue();

    //save hotel form data and now got to import service page
    this.hotelFormDataService.initHotelInfoFormData(
      { ...data.hotel, allServices: this.allServices },
      true
    );

    if (this.hotelId) {
      this.router.navigate([
        `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.hotelId}/import-services`,
      ]);
    } else {
      this.router.navigate([
        `/pages/settings/business-info/brand/${this.brandId}/hotel/import-services`,
      ]);
    }
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.hotelFormDataService.resetHotelInfoFormData();
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

  //to reset the form
  resetForm() {
    this.useForm.reset({}, { emitEvent: true });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
