import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { AdminUtilityService, NavRouteOptions } from 'libs/admin/shared/src';
import { Subscription } from 'rxjs';
import { businessRoute } from '../../constant/routes';
import { Service, Services, noRecordAction } from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { QueryConfig } from '@hospitality-bot/admin/library';
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
  limit = 10;
  offset = 0;

  constructor(
    private snackbarService: SnackBarService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService
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
    if (!this.businessService.hotelFormState) {
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

    if (this.businessService.hotelFormState) {
      this.filteredServices = this.businessService.hotelInfoFormData?.services;
      this.useForm.patchValue(this.businessService.hotelInfoFormData);
    } else {
      this.initOptionConfig();
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
          this.compServices = res.complimentaryPackages;
          this.filteredServices = this.compServices;

          // if (this.businessService.hotelInfoFormData)
          //   this.useForm.patchValue(this.businessService.hotelInfoFormData);
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
          status: true,
        },
      ]),
    };

    return config;
  };

  loadMore() {
    this.offset += this.limit;
    this.getServices();
  }

  saveForm() {
    debugger;
    this.businessService.initHotelInfoFormData(
      this.useForm.getRawValue(),
      true
    );

    this.businessService.setServiceIds(this.useForm.getRawValue().serviceIds);
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
