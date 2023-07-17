import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LibrarySearchItem } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ServicesTypeValue } from 'libs/admin/room/src/lib/constant/form';
import { Cancelable, debounce } from 'lodash';
import { Subscription } from 'rxjs';
import {
  VenueTabItemList,
  restaurantTabItemList,
  spaTabItemList,
} from '../../constants/data';
import {
  noRecordActionForCompWithId,
  noRecordActionForMenuWithId,
  noRecordActionForPaidWithId,
} from '../../constants/form';
import { MenuList } from '../../models/outlet.model';
import { Service, Services } from '../../models/services';
import { OutletFormService } from '../../services/outlet-form.service';
import { OutletService } from '../../services/outlet.service';
import { Menu, OutletType } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';

@Component({
  selector: 'hospitality-bot-view-all',
  templateUrl: './view-all.component.html',
  styleUrls: ['./view-all.component.scss'],
})
export class ViewAllComponent extends OutletBaseComponent implements OnInit {
  searchForm: FormGroup;
  useForm: FormGroup;
  loading: boolean;
  tabItemList = [];
  tabItemIdx = 0;
  selectedOutlet: string;
  isCompLoading: boolean;
  isPaidLoading: boolean;
  noRecordAction = {};
  noRecordActionPaidWithId = noRecordActionForPaidWithId;
  noRecordActionCompWithId = noRecordActionForCompWithId;
  noRecordActionForMenuWithId = noRecordActionForMenuWithId;

  /** Paid Services Variable */
  paidServices: Service[] = [];
  noMorePaidServices = false;
  paidOffset = 0;

  /** Complimentary Services Variable */
  compServices: Service[] = [];
  menuList: Menu[] = [];
  noMoreCompServices = false;
  compOffset = 0;

  limit = 15;
  disablePagination = false;
  subscription$ = new Subscription();
  selectedTabFilterItems = this.tabItemList[0]?.value;
  offset: number;
  constructor(
    route: ActivatedRoute,
    router: Router,
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private outletService: OutletService,
    private adminUtilityService: AdminUtilityService,
    private outletFormService: OutletFormService,
    private location: Location
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    if (!this.outletFormService.outletFormState) {
      this.location.back();
    }
    this.initForm();
    this.initSelectedService();
    this.registerSearch();
    this.initRoutes('services');
  }

  initForm(): void {
    this.useForm = this.fb.group({
      paidServiceIds: [[]],
      serviceIds: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });

    const {
      paidServiceIds,
      serviceIds,
    } = this.outletFormService.OutletFormData;

    this.useForm.patchValue({
      serviceIds,
      paidServiceIds,
    });
    // this.useForm.get('serviceIds').setValue(serviceIds);
  }

  initSelectedService() {
    //this will be used to set the selected tab filter item list according to the selected outlet
    this.selectedOutlet = this.outletFormService.OutletFormData
      .type as OutletType;

    switch (this.selectedOutlet) {
      case 'RESTAURANT':
        this.tabItemList = restaurantTabItemList;
        this.onSelectedTabFilterChange(0);
        break;

      case 'SPA':
        this.tabItemList = spaTabItemList;
        this.onSelectedTabFilterChange(0);
        break;

      case 'VENUE':
        this.tabItemList = VenueTabItemList;
        this.onSelectedTabFilterChange(0);
        break;
    }
  }

  onSelectedTabFilterChange(index: number): void {
    const data = this.tabItemList[index].value;
    this.compServices = [];
    this.paidServices = [];
    //this will be used to set and for api call according to the selected tab filter item list

    switch (data) {
      case 'PAID_SERVICES':
        this.selectedTabFilterItems = data;
        this.getServices(ServicesTypeValue.PAID);
        break;
      case 'COMPLIMENTARY_SERVICES':
        this.selectedTabFilterItems = data;
        this.getServices(ServicesTypeValue.COMPLIMENTARY);
        break;
    }
  }

  registerSearch() {
    let debounceCall: (() => void) & Cancelable;

    this.searchForm.get('searchText').valueChanges.subscribe((res) => {
      debounceCall?.cancel();
      if (res) {
        debounceCall = debounce(() => {
          this.loading = true;
          this.disablePagination = true;
          this.outletService
            .searchLibraryItem(this.outletId, {
              params: `?key=${res}&type=${LibrarySearchItem.SERVICE}`,
            })
            .subscribe(
              (res) => {
                this.loading = false;
                const data = res && res[LibrarySearchItem.SERVICE];
                const paidServices = [];
                const compServices = [];

                data?.forEach((item) => {
                  if (item.type == 'Paid' && item.active) {
                    paidServices.push(item);
                  }
                  if (item.type == 'Complimentary' && item.active) {
                    compServices.push(item);
                  }
                });

                this.paidServices = paidServices;
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
        this.paidOffset = 0;
        this.paidServices = [];
        this.compServices = [];
        this.getServices(ServicesTypeValue.COMPLIMENTARY);
        this.getServices(ServicesTypeValue.PAID);
        this.disablePagination = false;
      }
    });
  }

  /**
   * @function getServices to get amenities (paid and services)
   * @param serviceType
   */
  getServices(serviceType: ServicesTypeValue) {
    this.loading = true;
    this.isCompLoading = true;
    this.isPaidLoading = true;
    const config = this.getQueryConfig(
      serviceType === ServicesTypeValue.COMPLIMENTARY
        ? this.compOffset
        : this.paidOffset,
      serviceType
    );

    this.subscription$.add(
      this.outletService.getServices(this.outletId, config).subscribe(
        (res) => {
          /* Setting Paid Services */
          if (serviceType == ServicesTypeValue.PAID && res.paidPackages) {
            const data = new Services().deserialize(res.paidPackages).services;
            this.paidServices = [...this.paidServices, ...data];
            this.noMorePaidServices = data.length < 15;
          }

          /* Setting Complimentary Services */
          if (
            serviceType === ServicesTypeValue.COMPLIMENTARY &&
            res.complimentaryPackages
          ) {
            const data = new Services().deserialize(res.complimentaryPackages)
              .services;
            this.compServices = [...this.compServices, ...data];
            this.noMoreCompServices = data.length < 15;
          }
        },
        (error) => {
          this.snackbarService.openSnackBarAsText(error.error.message);
        },
        () => {
          this.loading = false;
          if (serviceType === ServicesTypeValue.COMPLIMENTARY) {
            this.isCompLoading = false;
          }
          if (serviceType === ServicesTypeValue.PAID) {
            this.isPaidLoading = false;
          }
        }
      )
    );
  }

  getQueryConfig = (offset: number, type: ServicesTypeValue): QueryConfig => {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          offset: offset,
          limit: this.limit,
          type: 'SERVICE',
          serviceType: type,
        },
      ]),
    };

    return config;
  };

  resetForm(): void {
    if (this.selectedTabFilterItems === ServicesTypeValue.COMPLIMENTARY) {
      this.useForm.get('complimentaryAmenities').setValue([]);
    }

    if (this.selectedTabFilterItems === ServicesTypeValue.PAID) {
      this.useForm.get('paidAmenities').setValue([]);
    }
  }

  saveForm(): void {
    this.outletFormService.initOutletFormData(this.useForm.getRawValue(), true);

    this.location.back();
  }

  loadMore() {
    if (this.selectedTabFilterItems === 'COMPLIMENTARY_SERVICES') {
      this.paidOffset = this.paidOffset + this.limit;
      this.getServices(ServicesTypeValue.PAID);
    }

    if (this.selectedTabFilterItems === 'PAID_SERVICES') {
      this.compOffset = this.compOffset + this.limit;
      this.getServices(ServicesTypeValue.COMPLIMENTARY);
    }
  }
}
