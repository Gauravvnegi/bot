import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ModuleNames, NavRouteOptions } from 'libs/admin/shared/src';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { Cancelable, debounce } from 'lodash';
import { noRecordAction, ServicesTypeValue } from '../../constant/form';
import { Service, Services } from '../../models/amenities.model';
import { RoomService } from '../../services/room.service';
import { QueryConfig } from '../../types/room';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import { routesConfig } from 'libs/admin/shared/src/lib/constants/config';
import roomRoutes, { roomRoutesConfig } from '../../constant/routes';
import { servicesRoutes } from 'libs/admin/services/src/lib/constant/routes';
@Component({
  selector: 'hospitality-bot-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit, OnDestroy {
  noRecordAction = noRecordAction;

  entityId: string;
  subscription$ = new Subscription();
  useForm: FormGroup;
  searchForm: FormGroup;
  loading: boolean;
  isCompLoading: boolean;
  isPaidLoading: boolean;
  limit = 15;

  pageTitle = 'Services';
  navRoutes: NavRouteOptions = [];

  tabItemIdx = 0;
  tabItemList = [
    { label: 'Complimentary Services', value: ServicesTypeValue.COMPLIMENTARY },
    { label: 'Paid Services', value: ServicesTypeValue.PAID },
  ];

  selectedService: ServicesTypeValue;

  /** Paid Services Variable */
  paidServices: Service[] = [];
  noMorePaidServices = false;
  paidOffset = 0;

  /** Complimentary Services Variable */
  compServices: Service[] = [];
  noMoreCompServices = false;
  compOffset = 0;

  disablePagination = false;
  roomTypeId: string;
  constructor(
    private roomService: RoomService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private router: Router,
    private location: Location,
    private libraryService: LibraryService,
    private routesConfigService: RoutesConfigService,
    private route: ActivatedRoute
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const roomTypeId = snapshot?.params['roomTypeId'];
        if (roomTypeId) {
          this.roomTypeId = roomTypeId;
        }
      }
    );
  }

  ngOnInit(): void {
    if (!this.roomService.selectedService) {
      this.location.back();
      return;
    }
    this.entityId = this.globalService.entityId;
    this.initForm();
    this.initOptionConfig();
    this.initSelectedService();
    this.initNavRoutes();
  }

  initSelectedService() {
    this.selectedService = this.roomService.selectedService;
    this.tabItemIdx = this.tabItemList.findIndex(
      (item) => item.value === this.selectedService
    );
  }

  initNavRoutes() {
    let path = '';
    this.routesConfigService.activeRouteConfigSubscription.subscribe(
      (activeRouteConfig) => {
        path = activeRouteConfig.submodule.fullPath;
      }
    );
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes];
      const roomRoutes =
        roomRoutesConfig[this.roomTypeId ? 'editRoomTypeServices' : 'services'];
      this.pageTitle = roomRoutes.title;
      const modifiedRoomType = roomRoutes.navRoutes.map((navRoute) => {
        if (navRoute.link.includes(':roomTypeId')) {
          navRoute.link = navRoute.link.replace(':roomTypeId', this.roomTypeId);
        }
        navRoute.link = path + '/' + navRoute.link;

        return navRoute;
      });
      this.navRoutes = [...this.navRoutes, ...modifiedRoomType];
    });
  }

  /**
   * @function initForm Initialize choose service form
   */
  initForm() {
    const {
      paidAmenities,
      complimentaryAmenities,
    } = this.roomService.roomTypeFormData;

    this.useForm = this.fb.group({
      complimentaryAmenities: [[]],
      paidAmenities: [[]],
    });

    this.searchForm = this.fb.group({
      searchText: [''],
    });

    this.useForm.patchValue({ paidAmenities, complimentaryAmenities });
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
          this.disablePagination = true;
          this.libraryService
            .searchLibraryItem(this.entityId, {
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
   * @function initOptionConfig Initialize dropdown options
   */
  initOptionConfig() {
    this.getServices(ServicesTypeValue.PAID);
    this.getServices(ServicesTypeValue.COMPLIMENTARY);
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent) {
    this.tabItemIdx = event.index;
    this.selectedService = this.tabItemList[this.tabItemIdx].value;
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
          visibilitySource: 'ADMIN_PANEL',
        },
      ]),
    };

    return config;
  };

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
      this.roomService.getServices(this.entityId, config).subscribe(
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

  loadMore() {
    if (this.selectedService === ServicesTypeValue.COMPLIMENTARY) {
      this.compOffset = this.compOffset + this.limit;
      this.getServices(ServicesTypeValue.COMPLIMENTARY);
    }

    if (this.selectedService === ServicesTypeValue.PAID) {
      this.paidOffset = this.paidOffset + this.limit;
      this.getServices(ServicesTypeValue.PAID);
    }
  }

  saveForm() {
    this.roomService.initRoomTypeFormData(
      this.useForm.getRawValue(),
      this.selectedService,
      true
    );

    this.location.back();
  }

  resetForm() {
    if (this.selectedService === ServicesTypeValue.COMPLIMENTARY) {
      this.useForm.get('complimentaryAmenities').setValue([]);
    }

    if (this.selectedService === ServicesTypeValue.PAID) {
      this.useForm.get('paidAmenities').setValue([]);
    }
  }

  navigateToAddService() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.SERVICES,
      additionalPath: servicesRoutes.createService.route,
    });
  }

  /**
   * Remove selected service value when components is removed
   */
  ngOnDestroy(): void {
    this.roomService.resetSelectedService();
  }
}
