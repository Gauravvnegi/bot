import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  HotelDetailService,
  ModuleNames,
  NavRouteOption,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { businessRoute } from '../../constant/routes';
import { SegmentList, Service, Services } from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { HotelFormDataService } from '../../services/hotel-form.service';
import { noRecordActionForCompWithId } from 'libs/admin/all-outlets/src/lib/constants/form';
import { Location } from '@angular/common';
declare let google: any;

@Component({
  selector: 'hospitality-bot-hotel-info-form',
  templateUrl: './hotel-info-form.component.html',
  styleUrls: ['./hotel-info-form.component.scss'],
})
export class HotelInfoFormComponent implements OnInit {
  entityId: string;
  siteId: string;
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
  noRecordAction = noRecordActionForCompWithId;

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
    private route: ActivatedRoute,
    private hotelFormDataService: HotelFormDataService,
    private hotelDetailService: HotelDetailService,
    private location: Location,
    private routesConfigService: RoutesConfigService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const entityId = snapshot?.params['entityId'];
        const brandId = snapshot?.params['brandId'];
        if (entityId) this.entityId = entityId;
        if (brandId) this.brandId = brandId;
      }
    );
    this.getSegmentList();
  }

  ngOnInit(): void {
    this.siteId = this.hotelDetailService.siteId;
    this.initForm();
    this.initNavRoutes();
  }

  initForm() {
    this.useForm = this.fb.group({
      entity: this.fb.group({
        status: [true],
        name: ['', [Validators.required]],
        propertyCategory: [''],
        emailId: [
          '',
          [Validators.pattern(Regex.EMAIL_REGEX), Validators.required],
        ],
        contact: this.fb.group({
          countryCode: ['+91'],
          number: [''],
        }),
        gstNumber: [''],
        address: [{}, Validators.required],
        imageUrl: [[], [Validators.required]],
        description: [''],
        serviceIds: [[]],
        socialPlatforms: [[]],
      }),
      brandId: [this.brandId],
      siteId: [this.siteId],
    });

    if (this.hotelFormDataService.hotelFormState) {
      this.allServices = [
        ...this.hotelFormDataService.hotelInfoFormData.services.map(
          (service) => service.id
        ),
        ...this.hotelFormDataService.hotelInfoFormData.allServices,
      ];

      this.compServices = this.hotelFormDataService.hotelInfoFormData.services.slice(
        0,
        5
      );
      this.useForm
        .get('entity')
        .patchValue(this.hotelFormDataService.hotelInfoFormData);
    }
    this.manageRoutes();

    //if hotel id is present then get the hotel by id and paatch the hotel detais
    if (this.entityId && !this.hotelFormDataService.hotelFormState) {
      this.businessService.getHotelById(this.entityId).subscribe((res) => {
        // const data = new HotelResponse().deserialize(res);
        const { propertyCategory, status, ...rest } = res;
        this.useForm
          .get('entity.propertyCategory')
          .patchValue(propertyCategory?.value);
        this.useForm.get('entity').patchValue(rest);
        this.useForm.get('entity').patchValue({ status: status === 'ACTIVE' });
      });

      //get the servcie list after getting hotel by id
      this.businessService
        .getServiceList(this.entityId, {
          params:
            '?type=SERVICE&serviceType=COMPLIMENTARY&pagination=false&visibilitySource=ADMIN_PANEL',
        })
        .subscribe((res) => {
          res = new Services().deserialize(res.complimentaryPackages).services;
          this.allServices = res.map((item) => item.id);

          this.compServices = res.slice(0, 5);

          this.hotelFormDataService.initHotelInfoFormData(
            { services: this.compServices },
            false
          );

          const data = res.filter((item) => item.active).map((item) => item.id);

          this.useForm.get('entity.serviceIds').patchValue(data);
        });
    }
  }

  manageRoutes() {
    let prefixPath = this.routesConfigService.activeRouteConfigSubscription
      .value.submodule.fullPath;

    const { navRoutes, title } = businessRoute[
      this.entityId ? 'editHotel' : 'hotel'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes.map((routes) => {
      return {
        ...routes,
        link:
          prefixPath +
          '/' +
          routes.link
            .replace(':brandId', this.brandId)
            .replace(':entityId', this.entityId),
      };
    });
  }

  initNavRoutes() {
    this.routesConfigService?.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
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
   * @function submitForm to submit form
   * @returns void
   * @description to submit form
   */
  submitForm() {
    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Please check data and try again !'
      );
      this.useForm.markAllAsTouched();
      return;
    }
    const data = this.useForm.getRawValue();
    // get modified segment
    data.entity.propertyCategory = this.segmentList.find(
      (item) => item?.value === data?.entity?.propertyCategory
    );
    data.entity.status = data.entity.status === true ? 'ACTIVE' : 'INACTIVE';
    console.log(data);

    //if entityId is present then update hotel else create hotel
    if (this.entityId) {
      this.$subscription.add(
        this.businessService
          .updateHotel(this.entityId, data.entity)
          .subscribe((res) => {}, this.handelError, this.handleSuccess)
      );
    } else {
      this.$subscription.add(
        this.businessService
          .createHotel(this.brandId, data)
          .subscribe((res) => {}, this.handelError, this.handleSuccess)
      );
    }
  }

  //to view all the services
  saveHotelData() {
    //saving the hotel data locally
    this.hotelFormDataService.initHotelInfoFormData(
      this.useForm.getRawValue().entity,
      true
    );

    if (this.entityId) {
      this.router.navigate(['services'], { relativeTo: this.route });
    } else {
      this.routesConfigService.navigate({
        subModuleName: ModuleNames.BUSINESS_INFO,
        additionalPath: `brand/${this.brandId}/hotel/services`,
      });
    }
  }

  //to import the services
  openImportService() {
    const data = this.useForm.getRawValue();
    //save hotel form data and now got to import service page
    this.hotelFormDataService.initHotelInfoFormData(
      { ...data.entity, allServices: this.allServices },
      true
    );
    this.router.navigate([businessRoute.importServices.route], {
      relativeTo: this.route,
    });
  }

  /**
   * @function handleSuccess To show success message
   * @returns void
   */
  handleSuccess = () => {
    this.hotelFormDataService.resetHotelInfoFormData();
    this.snackbarService.openSnackBarAsText(
      `Hotel ${this.entityId ? 'edited' : 'created'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.location.back();
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
