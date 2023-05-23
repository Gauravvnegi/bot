import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { NavRouteOptions } from 'libs/admin/shared/src';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Cancelable, debounce } from 'lodash';
import {
  LibrarySearchItem,
  LibraryService,
  QueryConfig,
} from '@hospitality-bot/admin/library';
import { BusinessService } from '../../services/business.service';
import { Services } from '../../models/hotel.models';
@Component({
  selector: 'hospitality-bot-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  noRecordAction = [];

  hotelId: string;
  $subscription = new Subscription();
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean;
  isCompLoading: boolean;
  isPaidLoading: boolean;
  limit = 10;
  selectedService: string;

  pageTitle = 'Services';
  navRoutes: NavRouteOptions = [];

  /** Paid Services Variable */
  paidServices: any[] = [];
  noMorePaidServices = false;
  paidOffset = 0;

  /** Complimentary Services Variable */
  compServices: any[] = [];
  noMoreCompServices = false;
  compOffset = 0;

  disablePagination = false;

  constructor(
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private businessService: BusinessService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.hotelId = this.route.snapshot.paramMap.get('brandId');
    this.initForm();
    this.initOptionConfig();
    this.initSelectedService();
  }

  initSelectedService() {
    this.selectedService = 'COMPLIMENTARY';
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

    this.registerSearch();
  }

  /**
   * @function searchServices
   */
  registerSearch() {
    let debounceCall: (() => void) & Cancelable;

    this.searchForm.get('searchText').valueChanges.subscribe((res) => {
      if (res) {
        debounceCall?.cancel();
        debounceCall = debounce(() => {
          this.loading = true;
          this.disablePagination = true;
          this.businessService
            .searchLibraryItem(this.hotelId, {
              params: `?key=${res}&type=${LibrarySearchItem.SERVICE}`,
            })
            .subscribe(
              (res) => {
                this.loading = false;
                const data = res && res[LibrarySearchItem.SERVICE];
                const compServices = [];

                data?.forEach((item) => {
                  if (item.type == 'Complimentary' && item.active) {
                    compServices.push(item);
                  }
                });
                this.compServices = compServices;
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
        this.compOffset = 0;
        this.compServices = [];
        this.getServices('COMPLIMENTARY');
        this.disablePagination = false;
      }
    });
  }

  /**
   * @function initOptionConfig Initialize dropdown options
   */
  initOptionConfig() {
    this.getServices('COMPLIMENTARY');
  }

  getQueryConfig = (offset: number, type: 'COMPLIMENTARY'): QueryConfig => {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          offset: offset,
          limit: this.limit,
          type: 'SERVICE',
          serviceType: type,
          status: true,
        },
      ]),
    };

    return config;
  };

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices(serviceType) {
    this.loading = true;
    this.isCompLoading = true;
    this.isPaidLoading = true;
    const config = this.getQueryConfig(this.compOffset, serviceType);

    this.$subscription.add(
      this.businessService.getServices().subscribe(
        (res) => {
          this.compServices = new Services().deserialize(res.service).services;

          console.log(this.compServices, 'this.compServices');
          console.log(
            this.businessService.hotelInfoFormData,
            'this.businessService.hotelInfoFormData'
          );
          if (this.businessService.hotelInfoFormData)
            this.useForm.patchValue(this.businessService.hotelInfoFormData);
        },
        (error) => {
          this.snackbarService.openSnackBarAsText(error.error.message);
        }
      )
    );
  }

  loadMore() {
    this.compOffset = this.compOffset + this.limit;
    this.getServices('COMPLIMENTARY');
  }

  saveForm() {
    this.businessService.initHotelInfoFormData(this.useForm.getRawValue());
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
