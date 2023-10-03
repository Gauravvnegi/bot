import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService, UserService } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { ModuleNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { Subscription } from 'rxjs';
import { tokensConfig } from '../../../../../../../../../../../libs/admin/shared/src/lib/constants/common';
import { layoutConfig } from '../../../constants/layout';
import { DateRangeFilterService } from '../../../services/daterange-filter.service';
import { FilterService } from '../../../services/filter.service';
import { GlobalFilterService } from '../../../services/global-filters.service';
import { LoadingService } from '../../../services/loader.service';
import { FirebaseMessagingService } from '../../../services/messaging.service';
import { NotificationService } from '../../../services/notification.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import {
  navRoute,
  manageGuestRoutes,
} from 'libs/admin/guests/src/lib/constant/route';
import { SettingsMenuComponent } from '../../../../../../../../../../../libs/admin/settings/src/lib/components/settings-menu/settings-menu.component';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-in', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class LayoutOneComponent implements OnInit, OnDestroy {
  readonly moduleNames = ModuleNames;
  backgroundColor: string;
  background_image: string;
  menuItem: any;
  menuTitle: string;
  logoUrl: string;
  bgColor: string;
  outlets = [];
  lastUpdatedAt: string;
  isGlobalFilterVisible = false;
  showNotification = false;
  flashNotification: any;
  delayTime = layoutConfig.notificationDelayTime;
  isDetailPageVisible = false;
  isNotificationVisible = false;
  private $subscription = new Subscription();
  searchFG: FormGroup;
  timezone: string;
  isExpand = false;
  filterConfig = {
    brandName: '',
    branchName: '',
    totalFilters: 0,
    totalFilterContent: function () {
      return this.totalFilters <= 0 ? '' : `(+${this.totalFilters}) Others`;
    },
  };
  notificationFilterData = {
    status: [],
    fromDate: '',
    toDate: '',
  };
  unreadCount: number;
  private $firebaseMessagingSubscription = new Subscription();
  isGlobalSearchVisible = true;
  isSitesAvailable: boolean;
  bookingOptions: MenuItem[];
  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  sidebarType: 'complaint' | 'settings' = 'complaint';

  constructor(
    private _router: Router,
    public filterService: FilterService,
    public dateRangeFilterService: DateRangeFilterService,
    public progressSpinnerService: ProgressSpinnerService,
    public globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private _userService: UserService,
    private fb: FormBuilder,
    private firebaseMessagingService: FirebaseMessagingService,
    private subscriptionPlanService: SubscriptionPlanService,
    private loadingService: LoadingService,
    private notificationService: NotificationService,
    private configService: ConfigService,
    private hotelDetailService: HotelDetailService,
    private resolver: ComponentFactoryResolver
  ) {
    this.initFG();
  }

  ngOnInit() {
    this.initLayoutConfigs();
    this.globalFilterService.listenForGlobalFilterChange();
    this.setInitialFilterValue();
    this.loadingService.close();
    this.getNotificationUnreadCount();
    this.$subscription.add(
      this.configService.$config.subscribe((response) => {
        if (response) {
          this.flashNotification = response?.flashNotifications;
          this.initNotification();
        }
      })
    );
    //reset scroll to top on route change
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.scrollToTop();
      }
    });
    this.initBookingOption();
  }

  scrollToTop() {
    const mainLayout = document.getElementById('main-layout');
    mainLayout.scrollTo(0, 0);
  }

  initNotification() {
    if (this.flashNotification?.notificationView) {
      const { delayTimeAllow = false, delayTime } = this.flashNotification;
      this.delayTime = delayTimeAllow ? delayTime : this.delayTime;
      this.showNotification = true;
    }
    setTimeout(() => {
      this.showNotification = false;
    }, this.delayTime * 1000);
  }

  initFirebaseMessaging(entityId?) {
    const requestPermissionData = {
      entityId: entityId,
      userId: this._userService.getLoggedInUserId(),
    };
    this.firebaseMessagingService.requestPermission(requestPermissionData);
    this.$firebaseMessagingSubscription.add(
      this.firebaseMessagingService.receiveMessage().subscribe((payload) => {
        console.log(payload, 'payload message when notification trigger');
        const notificationPayload = payload;
        this.firebaseMessagingService.playNotificationSound();
        this.getNotificationUnreadCount();
        if (notificationPayload) {
          switch (notificationPayload['data']?.notificationType) {
            case 'Live Request':
              if (this.checkForMessageRoute())
                this.firebaseMessagingService.liveRequestEnable.next(
                  notificationPayload
                );
              break;
            case 'In-house Request':
              if (this._router.url.includes('complaint')) {
                this.firebaseMessagingService.newInhouseRequest.next(
                  notificationPayload
                );
              } else {
                this.firebaseMessagingService.showNotificationAsSnackBar(
                  payload
                );
              }
              break;
            default:
              if (this.checkForMessageRoute())
                this.firebaseMessagingService.currentMessage.next(payload);
              else if (Object.keys(payload).length) {
                this.firebaseMessagingService.showNotificationAsSnackBar(
                  payload
                );
              }
              break;
          }
        }
      })
    );
  }

  initFG(): void {
    this.searchFG = this.fb.group({
      search: [''],
    });
  }

  checkForMessageRoute() {
    return this._router.url.includes('messages');
  }

  initLayoutConfigs() {
    this.backgroundColor = 'white';
    this.lastUpdatedAt = DateService.getCurrentDateWithFormat('h:mm A');
  }

  setInitialFilterValue() {
    const selectedSiteId = this._hotelDetailService.siteId;
    const selectedentityId = this._hotelDetailService.entityId;
    const selectedHotelData = this._hotelDetailService.hotels.find(
      (item) => item.id === selectedentityId
    );
    const selectedBrandId = this._hotelDetailService.brandId;
    const selectedBrandData = this._hotelDetailService.brands.find(
      (item) => item.id === selectedBrandId
    );

    this.logoUrl = selectedHotelData?.['logoUrl'];
    this.bgColor = selectedHotelData?.['headerBgColor'];
    this.outlets = selectedHotelData?.['entities'] ?? [];
    this.filterConfig.brandName = selectedBrandData?.['name'];
    this.filterConfig.branchName = selectedHotelData?.['name'];
    this.filterService.emitFilterValue$.next({
      property: {
        brandName: selectedBrandData?.['id'],
        entityName: selectedHotelData?.['id'],
      },
      feedback: {
        feedbackType: layoutConfig.feedback.both,
      },
      isAllOutletSelected: this.outlets.length !== 0,

      outlets: this.outlets.reduce(
        (acc, curr) => ((acc[curr.id] = true), acc),
        {}
      ),
    });
    this.initFirebaseMessaging(selectedHotelData?.['id']);
    this.timezone = selectedHotelData?.['timezone'];
    this.globalFilterService.timezone = this.timezone;
    this.globalFilterService.entityId = selectedentityId;
    this.globalFilterService.entityType = selectedHotelData.category;
    this.globalFilterService.entitySubType = selectedHotelData.type;
    this.isSitesAvailable =
      !!selectedSiteId && !!this._hotelDetailService.sites?.length;
  }

  refreshDashboard() {
    const currentUrl = this._router.url;
    this._router.routeReuseStrategy.shouldReuseRoute = () => false;
    this._router.onSameUrlNavigation = 'reload';
    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
      this.lastUpdatedAt = DateService.getCurrentDateWithFormat('h:mm A');
    });
  }

  enableGlobalFilter(el) {
    this.isGlobalFilterVisible = true;
    this.isGlobalSearchVisible = false;
    this.isNotificationVisible = false;
    el.scrollTop = 0;
  }

  enableGlobalSearch() {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = true;
    this.isNotificationVisible = false;
  }

  enableNotification(el) {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = false;
    this.isNotificationVisible = true;
    el.scrollTop = 0;
  }

  disableFilter() {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = false;
    this.isNotificationVisible = false;
  }

  closeGlobalFilter() {
    this.isGlobalFilterVisible = false;
  }

  applyFilter(event) {
    const values = event.values;
    const entityId = values.property.entityName;
    const brandId = values.property.brandName;
    if (event.token.key && event.token.value && entityId && brandId) {
      /**
       * Update business session will update the local storage and reload to reset the data
       */
      this._hotelDetailService.updateBusinessSession({
        [tokensConfig.accessToken]: event.token.value,
        [tokensConfig.entityId]: entityId,
        [tokensConfig.brandId]: brandId,
      });
    }

    this.filterService.emitFilterValue$.next(values);
    this.resetFilterCount();
    this.getFilterCount({ ...values });
    this.isGlobalFilterVisible = false;
  }

  subMenuItem(data) {
    this.menuTitle = data.title;
    this.menuItem = data.list;
  }

  sideNavToggle(item) {
    this.isExpand = item;
  }

  resetFilterCount() {
    this.filterConfig.totalFilters = 0;
  }

  getFilterCount(event) {
    if (!event) {
      return;
    }
    if (event.property) {
      delete event.property;
    }
    const filterObj = event;
    for (let key in filterObj) {
      if (
        !Array.isArray(filterObj[key]) &&
        filterObj[key] &&
        filterObj[key].constructor.name !== 'Object'
      ) {
        if (filterObj[key]) {
          this.filterConfig.totalFilters += 1;
        }
      } else {
        this.getFilterCount(filterObj[key]);
      }
    }
  }

  resetFilter(event) {
    this.filterService.emitFilterValue$.next(event);
    this.resetFilterCount();
    this.getFilterCount({ ...event });
  }

  applyDateRangeFilter(event) {
    this.dateRangeFilterService.emitDateRangeFilterValue$.next(event);
  }

  // checkForTransactionFeedbackSubscribed() {
  //   return this.subscriptionPlanService.checkModuleSubscription(
  //     ModuleNames.FEEDBACK_TRANSACTIONAL
  //   );
  // }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.hidden) {
      this.firebaseMessagingService.tabActive.next(false);
    } else if (this._router.url.includes('messages')) {
      this.firebaseMessagingService.tabActive.next(true);
    }
  }

  setNotificationFilterData(event): void {
    this.notificationFilterData = event.data;
  }

  closeNotification(): void {
    this.isNotificationVisible = false;
    this.getNotificationUnreadCount();
  }

  getNotificationUnreadCount() {
    this.notificationService
      .getUnreadCount(this._userService.getLoggedInUserId())
      .subscribe((response) => (this.unreadCount = response?.unreadCount));
  }

  initBookingOption() {
    const propertyList = this.hotelDetailService.getPropertyList();
    this.bookingOptions = [
      this.checkModuleSubscription(ModuleNames.ADD_RESERVATION)
        ? {
            label: 'New Booking',
            icon: 'pi pi-calendar',
            ...(!!propertyList.length
              ? {
                  items: propertyList.map((item) => ({
                    label: item.label,
                    command: () => {
                      this.openNewWindow(
                        `/pages/efrontdesk/reservation/${manageReservationRoutes.addReservation.route}?entityId=${item.value}`
                      );
                    },
                  })),
                }
              : {
                  command: () =>
                    this.openNewWindow(`/pages/efrontdesk/reservation`),
                }),
          }
        : null,
      this.checkModuleSubscription(ModuleNames.GUESTS)
        ? {
            label: 'New Guest',
            icon: 'pi pi-user-plus',
            command: () =>
              this.openNewWindow(
                `${navRoute.guest.link}/${manageGuestRoutes.addGuest.route}`
              ),
          }
        : null,
      this.checkModuleSubscription(ModuleNames.REQUEST)
        ? {
            label: 'New Complaint',
            icon: 'pi pi-exclamation-circle',
            command: () => {
              this.sidebarVisible = true;
              this.sidebarType = 'complaint';
              const factory = this.resolver.resolveComponentFactory(
                RaiseRequestComponent
              );
              this.sidebarSlide.clear();
              const componentRef = this.sidebarSlide.createComponent(factory);
              componentRef.instance.isSideBar = true;
              componentRef.instance.onRaiseRequestClose.subscribe((res) => {
                this.sidebarVisible = false;
              });
            },
          }
        : null,
    ].filter((item) => item);
  }

  openNewWindow(url: string) {
    window.open(url);
  }

  openSettings() {
    this.sidebarVisible = true;
    const factory = this.resolver.resolveComponentFactory(
      SettingsMenuComponent
    );
    this.sidebarSlide.clear();
    this.sidebarType = 'settings';
    const componentRef = this.sidebarSlide.createComponent(factory);
    componentRef.instance.isSideBar = true;
    componentRef.instance.closeEvent.subscribe((res) => {
      this.sidebarVisible = false;
    });
  }

  checkModuleSubscription(module) {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.MEMBERS
    );
  }

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }

  get isCreateWithSubscribed() {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.CREATE_WITH
    );
  }

  get selectedProduct() {
    return this.subscriptionPlanService
      .getSubscription()
      .products.find(
        (item) => item.name === this.subscriptionPlanService.selectedProduct
      );
  }
}
