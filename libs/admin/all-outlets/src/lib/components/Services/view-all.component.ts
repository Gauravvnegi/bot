import { Component, OnInit } from '@angular/core';
import { OutletBaseComponent } from '../outlet-base.components';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ServicesTypeValue } from 'libs/admin/room/src/lib/constant/form';
import { Service, Services } from '../../models/services';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { OutletService } from '../../services/outlet.service';
import { Location } from '@angular/common';
import {
  AdminUtilityService,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { OutletFormService } from '../../services/outlet-form.service';
import {
  VenueTabItemList,
  restaurantTabItemList,
  spaTabItemList,
} from '../../constants/data';
import { Menu, MenuResponse, OutletType } from '../../types/outlet';
import {
  noRecordActionForCompWithId,
  noRecordActionForMenuWithId,
  noRecordActionForPaidWithId,
} from '../../constants/form';
import { MenuList } from '../../models/outlet.model';

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
  noRecordActionForCompWithId = noRecordActionForCompWithId;
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

  limit = 10;
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
    this.initForm();
    this.initSelectedService();
    if (!this.outletFormService.outletFormState) {
      this.location.back();
    }
  }

  initForm(): void {
    this.initComponent('viewAll');
    this.useForm = this.fb.group({
      paidServiceIds: [[]],
      serviceIds: [[]],
      menuIds: [[]],
      foodPackageIds: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });

    const {
      paidServiceIds,
      serviceIds,
      menuIds,
      foodPackageIds,
    } = this.outletFormService.OutletFormData;

    this.useForm.patchValue({
      serviceIds,
      paidServiceIds,
      menuIds,
      foodPackageIds,
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
    this.compServices = [];
    this.paidServices = [];
    this.menuList = [];
    //this will be used to set and for api call according to the selected tab filter item list
    const data = this.tabItemList[index].value;

    switch (data) {
      case 'PAID_SERVICES':
        this.selectedTabFilterItems = data;
        this.getServices(ServicesTypeValue.PAID);
        break;
      case 'COMPLIMENTARY_SERVICES':
        this.selectedTabFilterItems = data;
        this.getServices(ServicesTypeValue.COMPLIMENTARY);
        break;
      case 'MENU':
        this.getMenuList();
        this.selectedTabFilterItems = data;

        break;
      case 'FOOD_PACKAGE':
        this.selectedTabFilterItems = data;
        break;
    }
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
            this.noMorePaidServices = data.length < 10;
          }

          /* Setting Complimentary Services */
          if (
            serviceType === ServicesTypeValue.COMPLIMENTARY &&
            res.complimentaryPackages
          ) {
            const data = new Services().deserialize(res.complimentaryPackages)
              .services;
            this.compServices = [...this.compServices, ...data];
            this.noMoreCompServices = data.length < 10;
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

  getMenuList() {
    this.subscription$.add(
      this.outletService.getMenuList(this.outletId).subscribe((res) => {
        this.menuList = new MenuList().deserialize(res).records;
      })
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
          status: true,
        },
      ]),
    };

    return config;
  };

  resetForm(): void {
    this.useForm.reset();
  }

  saveForm(): void {
    this.outletFormService.initOutletFormData(this.useForm.getRawValue(), true);

    this.location.back();
  }

  loadMore() {
    if (this.entityId) {
      this.offset += this.limit;
      // this.getServices();
    }
  }
}
