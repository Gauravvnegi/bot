import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AdminUtilityService, NavRouteOptions } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { businessRoute } from '../../constant/routes';
import {
  Service,
  ServiceIdList,
  noRecordAction,
} from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { HotelFormDataServcie } from '../../services/hotel-form.service';
import { ServcieStatusList } from '../../models/hotel-form.model';
@Component({
  selector: 'hospitality-bot-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  noRecordAction = noRecordAction;
  brandId: string;
  hotelId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean;
  pageTitle = 'Services';
  navRoutes: NavRouteOptions;
  compServices: Service[] = [];
  filteredServices: any[] = [];
  noMoreServices = false;
  limit = 10;
  offset = 0;

  constructor(
    private snackbarService: SnackBarService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private hotelFormDataServcie: HotelFormDataServcie
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
    if (!this.hotelFormDataServcie.hotelFormState) {
      this.location.back();
      return;
    }
    this.initForm();
  }

  /**
   * @function initForm Initialize choose service form
   */
  initForm() {
    this.useForm = this.fb.group({
      serviceIds: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });

    if (this.hotelId) {
      this.initOptionConfig();
    }

    if (this.hotelFormDataServcie.hotelFormState && !this.hotelId) {
      this.filteredServices = this.hotelFormDataServcie.hotelInfoFormData?.services;
      this.useForm
        .get('serviceIds')
        .patchValue(this.hotelFormDataServcie.getActiveServiceIds());
    }

    this.manageRoutes();
    this.registerSearch();
  }

  /**
   * @function searchServices
   */
  registerSearch() {
    this.searchForm.get('searchText').valueChanges.subscribe((res) => {
      if (res) {
        this.filteredServices = this.compServices.filter((service) =>
          service.name.toLowerCase().includes(res.toLowerCase())
        );
      } else {
        this.filteredServices = this.compServices;
      }
    });
  }

  manageRoutes() {
    const { navRoutes, title } = businessRoute[
      this.hotelId ? 'editServices' : 'services'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.navRoutes[2].link.replace('brandId', this.brandId);
    if (this.hotelId) {
      this.navRoutes[3].link = `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.hotelId}`;
      this.navRoutes[3].isDisabled = false;
    } else {
      this.navRoutes[3].link = `/pages/settings/business-info/brand/${this.brandId}/hotel`;
      this.navRoutes[3].isDisabled = false;
    }
  }

  /**
   * @function initOptionConfig Initialize dropdown options
   */
  initOptionConfig() {
    this.getServices();
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices() {
    this.loading = true;

    const config = this.getQueryConfig(this.offset);
    this.$subscription.add(
      this.businessService.getServiceList(this.hotelId, config).subscribe(
        (res) => {
          this.compServices = [
            ...this.compServices,
            ...res.complimentaryPackages,
          ];
          this.filteredServices = this.compServices;

          const inActiveServiceIds = this.hotelFormDataServcie
            .getInActiveServiceList()
            .map((service) => service.id);

          const activeIds = this.compServices
            .filter(
              (service) =>
                service.active && !inActiveServiceIds.includes(service.id)
            )
            .map((service) => service.id);

          this.hotelFormDataServcie.setActiveServiceIds(activeIds);

          this.useForm
            .get('serviceIds')
            .patchValue(this.hotelFormDataServcie.getActiveServiceIds());

          this.hotelFormDataServcie.hotelInfoFormData.services = this.compServices;

          if (this.compServices.length === res.total) {
            this.noMoreServices = true;
          }
        },
        (error) => {
          this.snackbarService.openSnackBarAsText(error.error.message);
          this.loading = false;
        },
        () => {
          this.loading = false;
        }
      )
    );
  }

  getQueryConfig = (offset: number): QueryConfig => {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          offset: offset,
          limit: this.limit,
          type: 'SERVICE',
          serviceType: 'COMPLIMENTARY',
        },
      ]),
    };

    return config;
  };

  loadMore() {
    if (this.hotelId) {
      this.offset += this.limit;
      this.getServices();
    }
  }

  saveForm() {
    this.hotelFormDataServcie.setActiveServiceIds(
      this.useForm.getRawValue().serviceIds
    );

    this.hotelFormDataServcie.isReturnFromService = true;

    //to get active and inactive services
    const data = new ServcieStatusList().deserialize(
      this.compServices,
      this.useForm.getRawValue().serviceIds
    );
    // extract active and inactive services from the list
    const { activeServiceList, inActiveServiceList } = data;
    this.hotelFormDataServcie.setInActiveServiceList(inActiveServiceList);
    console.log(this.hotelFormDataServcie.getInActiveServiceList());

    this.hotelFormDataServcie.initHotelInfoFormData(
      this.useForm.getRawValue(),
      true
    );
    // this.businessService.setServiceIds(this.useForm.getRawValue().serviceIds);
    if (this.hotelId) {
      this.businessService
        .updateHotel(this.hotelId, {
          serviceIds: this.useForm.getRawValue().serviceIds,
        })
        .subscribe((_res) => {});
    }
    this.location.back();
  }

  resetForm() {
    this.useForm.get('serviceIds').setValue([]);
  }

  /**
   * Remove selected service value when components is removed
   */
  ngOnDestroy(): void {}
}
