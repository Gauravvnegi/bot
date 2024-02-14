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
  Services,
  noRecordAction,
} from '../../models/hotel.models';
import { BusinessService } from '../../services/business.service';
import { HotelFormDataService } from '../../services/hotel-form.service';
import { ServcieStatusList } from '../../models/hotel-form.model';
import { Cancelable, debounce } from 'lodash';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
@Component({
  selector: 'hospitality-bot-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  noRecordAction = noRecordAction;
  brandId: string;
  entityId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean;
  pageTitle = 'Services';
  navRoutes: NavRouteOptions;
  compServices: Service[] = [];
  filteredServices: any[] = [];
  noMoreServices = false;
  limit = 15;
  offset = 0;

  constructor(
    private snackbarService: SnackBarService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private businessService: BusinessService,
    private route: ActivatedRoute,
    private adminUtilityService: AdminUtilityService,
    private hotelDataService: HotelFormDataService,
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
  }

  ngOnInit(): void {
    if (!this.hotelDataService.hotelFormState) {
      this.location.back();
      return;
    }
    this.initForm();
    this.initNavRoutes();
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

    if (this.entityId) {
      this.initOptionConfig();
      const data = this.hotelDataService.hotelInfoFormData.serviceIds;
      this.useForm.get('serviceIds').patchValue(data);
    }

    if (this.hotelDataService.hotelFormState && !this.entityId) {
      this.compServices = this.hotelDataService.hotelInfoFormData?.services;

      this.useForm
        .get('serviceIds')
        .patchValue(this.hotelDataService.hotelInfoFormData?.serviceIds);
    }

    this.manageRoutes();
    this.registerSearch();
  }

  /**
   * @function searchServices
   */
  registerSearch() {
    let debounceCall: (() => void) & Cancelable;

    this.searchForm.get('searchText').valueChanges.subscribe((res) => {
      debounceCall?.cancel();

      if (res) {
        debounceCall = debounce(() => {
          this.loading = true;
          this.businessService
            .searchLibraryItem(this.entityId, {
              params: `?key=${res}&type=SERVICE`,
            })
            .subscribe(
              (res) => {
                const data = res && res['SERVICE'];
                const compServices = [];

                data?.forEach((item) => {
                  if (item.type == 'Complimentary' && item.active) {
                    compServices.push(item);
                  }
                });
                this.compServices = compServices;
                this.filteredServices = this.compServices;
              },
              (error) => {
                this.snackbarService.openSnackBarAsText(error.error.message);
              },
              () => {
                this.loading = false;
              }
            );
        }, 500);
        debounceCall();
      } else {
        this.offset = 0;
        this.compServices = [];
        this.getServices();
      }
    });
  }

  manageRoutes() {
    let prefixPath = this.routesConfigService.activeRouteConfigSubscription
      .value.submodule.fullPath;

    const { navRoutes, title } = businessRoute[
      this.entityId ? 'editServices' : 'services'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes.map((route) => {
      return {
        ...route,
        link:
          prefixPath +
          '/' +
          route.link
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
      this.businessService.getServiceList(this.entityId, config).subscribe(
        (res) => {
          const data = new Services().deserialize(res.complimentaryPackages);
          this.compServices = [...this.compServices, ...data.services];

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
          visibilitySource: 'ADMIN_PANEL',
        },
      ]),
    };

    return config;
  };

  loadMore() {
    if (this.entityId) {
      this.offset += this.limit;
      this.getServices();
    }
  }

  saveForm() {
    this.hotelDataService.initHotelInfoFormData(
      this.useForm.getRawValue(),
      true
    );

    this.location.back();
  }

  resetForm() {
    this.useForm.get('serviceIds').setValue([]);
  }

  /**
   * Remove selected service value when components is removed
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
