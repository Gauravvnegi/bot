import { animate, style, transition, trigger } from '@angular/animations';
import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { ConfigService, UserService } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { manageReservationRoutes } from 'libs/admin/manage-reservation/src/lib/constants/routes';
import {
  ModuleNames,
  PermissionModuleNames,
  ProductNames,
} from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { MenuItem } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  defaultNotificationFilter,
  layoutConfig,
} from '../../../constants/layout';
import { DateRangeFilterService } from '../../../services/daterange-filter.service';
import { FilterService } from '../../../services/filter.service';
import { GlobalFilterService } from '../../../services/global-filters.service';
import { LoadingService } from '../../../services/loader.service';
import { FirebaseMessagingService } from '../../../services/messaging.service';
import { NotificationService } from '../../../services/notification.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';
import {
  RouteConfigPathService,
  RoutesConfigService,
} from '../../../services/routes-config.service';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { NightAuditService } from 'libs/admin/global-shared/src/lib/services/night-audit.service';
import {
  SideBarConfig,
  SideBarService,
} from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';
import { tokensConfig } from 'libs/admin/shared/src/lib/constants/common';

type MessagePayload = {
  data: {
    nickName: string;
    message: string;
    phoneNumber: string;
    isBuzz: string;
    isMute: string;
    notificationType: string;
  };
  from: string;
  fcmMessageId: string;
  notification: {};
};
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
  isNightAuditPending = false;

  isGlobalFilterVisible = false;
  showNotification = false;
  isDetailPageVisible = false;
  isNotificationVisible = false;
  fullView: boolean = false;
  showTooltip: boolean = false;

  flashNotification: any;
  delayTime = layoutConfig.notificationDelayTime;
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
  notificationFilterData = { ...defaultNotificationFilter };
  unreadCount: number;
  private $firebaseMessagingSubscription = new Subscription();
  isGlobalSearchVisible = true;
  isSitesAvailable: boolean;
  bookingOptions: MenuItem[];
  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  sidebarType: string = 'complaint';
  propertyList: any[];

  @ViewChild('url') urlTemplate: TemplateRef<any>;
  iframeTempUrl: string;

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
    private routesConfigService: RoutesConfigService,
    private nightAuditService: NightAuditService,
    private sideBarService: SideBarService
  ) {
    this.initFG();
  }

  ngOnInit() {
    this.initLayoutConfigs();
    this.globalFilterService.listenForGlobalFilterChange();
    this.globalFilterService.toggleFullView.subscribe(
      (res: boolean) => (this.fullView = res)
    );
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
    this.initSidebarSubscription();
  }

  ngAfterViewInit(): void {
    // Set the sidebarSlide reference in the service
    this.sideBarService.sidebarSlide = this.sidebarSlide;
  }

  initSidebarSubscription() {
    this.sideBarService
      .sideBarSubscription()
      .subscribe((res: SideBarConfig) => {
        if (res.open) {
          if (res.type === 'RAISE_REQUEST') {
            this.showComplaint();
          }
          if (res.type === 'URL') {
            this.openSideBarWithUrl(res.url);
          }
        }
      });
  }
  /**
   * open sidebar with iframe popup
   * @param url link to be open in iframe
   */
  openSideBarWithUrl(url: string) {
    this.iframeTempUrl = url;
    this.sidebarType = 'url';
    this.sideBarService.openSidebar({
      templateRef: this.urlTemplate,
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => (this.sidebarVisible = false),
    });
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

        this.firebaseMessagingService.receivedNewNotification();

        const notificationPayload = payload as MessagePayload;
        this.getNotificationUnreadCount();

        const isMuted = notificationPayload.data.isMute === 'true';

        !isMuted &&
          this.firebaseMessagingService.playNotificationSound(
            notificationPayload['data']?.notificationType,
            notificationPayload['data']?.isBuzz
          );
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
              else if (Object.keys(payload).length && !isMuted) {
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
    return (
      this.routesConfigService.subModuleName === ModuleNames.LIVE_MESSAGING
    );
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

      outlets: this.outlets
        .filter((outlet) => outlet?.status === 'ACTIVE')
        .reduce((acc, curr) => ((acc[curr.id] = true), acc), {}),
    });
    this.initFirebaseMessaging(selectedHotelData?.['id']);
    this.timezone = selectedHotelData?.['timezone'];
    this.globalFilterService.timezone = this.timezone;
    this.globalFilterService.entityId = selectedentityId;
    this.globalFilterService.entityType = selectedHotelData.category;
    this.globalFilterService.entitySubType = selectedHotelData.type;
    this.isSitesAvailable =
      !!selectedSiteId && !!this._hotelDetailService.sites?.length;

    if (this.isPredictoSubscribed) {
      // first time adding subscription
      this.nightAuditCheckListener();
      this.nightAuditCheck();

      //every 15 minute, we will check
      setInterval(() => {
        this.nightAuditCheck();
      }, 15 * 60 * 1000);
    }
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

  /**
   * Listening for active doc (When we switch from some other window)
   */
  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    const routeService = new RouteConfigPathService();

    const messagePath = routeService.getRouteFromName(
      ModuleNames.LIVE_MESSAGING
    );

    if (document.hidden) {
      this.getNotificationUnreadCount(); // Refreshing the count
      this.firebaseMessagingService.receivedNewNotification(); // Refreshing notification if opened
      this.firebaseMessagingService.tabActive.next(false);
    } else if (this._router.url.includes(messagePath)) {
      this.firebaseMessagingService.tabActive.next(true); // Refreshing message list in for the chat module
    }
  }

  setNotificationFilterData(event): void {
    this.notificationFilterData = event.data;
  }

  closeNotification(): void {
    this.isNotificationVisible = false;
    // reset filter too
    this.notificationFilterData = { ...defaultNotificationFilter };

    this.getNotificationUnreadCount();
  }

  getNotificationUnreadCount() {
    this.notificationService
      .getUnreadCount(this._userService.getLoggedInUserId())
      .subscribe((response) => (this.unreadCount = response?.unreadCount));
  }

  get hasPermissionToViewModule() {
    const isProductSubscribed = this.subscriptionPlanService.checkProductSubscription(
      this.routesConfigService.productName
    );

    if (!isProductSubscribed) return true;

    const isModuleSubscribed = this.subscriptionPlanService.checkModuleSubscriptionWithRespectiveToProduct(
      this.routesConfigService.productName,
      this.routesConfigService.subModuleName
    );

    if (!isModuleSubscribed) return true;

    const doestProductHasPermission = this.subscriptionPlanService.hasViewUserPermission(
      {
        name: this.routesConfigService.productName,
        type: 'product',
      }
    );

    if (!doestProductHasPermission) return true;

    const isComingSoon = this.subscriptionPlanService.isComingSoonModule(
      this.routesConfigService.subModuleName
    );

    if (isComingSoon) return true;

    return this.subscriptionPlanService.hasViewUserPermission({
      type: 'module',
      name: this.routesConfigService.subModuleName,
    });
  }

  initBookingOption() {
    this.propertyList = this.hotelDetailService.getPropertyList();
    this.bookingOptions = [
      this.subscriptionPlanService.show().isCalenderView
        ? {
            label: 'New Booking',
            icon: 'pi pi-calendar',
            ...(!!this.propertyList.length
              ? {
                  items: this.propertyList.map((item) => ({
                    label: item.label,
                    command: () => {
                      this.openNewWindow(
                        ModuleNames.ADD_RESERVATION,
                        `/${manageReservationRoutes.addReservation.route}?entityId=${item.value}`
                      );
                    },
                  })),
                }
              : {
                  command: () =>
                    this.openNewWindow(ModuleNames.ADD_RESERVATION),
                }),
          }
        : null,
      this.isGuestSubscribed
        ? {
            label: 'New Guest',
            icon: 'pi pi-user-plus',
            command: () => {
              this.showAddGuest();
            },
          }
        : null,
      this.isComplaintTrackerSubscribed
        ? {
            label: 'New Complaint',
            icon: 'pi pi-exclamation-circle',
            command: () => this.showComplaint(),
          }
        : null,
    ].filter((item) => item);
  }

  showComplaint() {
    this.sidebarType = 'complaint';
    this.sideBarService.openSidebar({
      componentName: 'RaiseRequest',
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => (this.sidebarVisible = false),
    });
  }

  showAddGuest() {
    this.sidebarType = 'guest-sidebar';
    this.sideBarService.openSidebar({
      componentName: 'AddGuest',
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => (this.sidebarVisible = false),
    });
  }

  showQuickReservation() {
    this.sidebarType = 'booking';
    this.sideBarService.openSidebar({
      componentName: 'QuickReservation',
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => {
        this.sidebarVisible = false;
        if (res) this.refreshDashboard();
      },
    });
  }

  openNightAudit() {
    this.sidebarType = 'booking';
    this.sideBarService.openSidebar({
      componentName: 'NightAudit',
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => (this.sidebarVisible = false),
    });
  }

  openSettings() {
    this.sidebarType = 'settings';
    this.sideBarService.openSidebar({
      componentName: 'SettingsMenu',
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => (this.sidebarVisible = false),
    });
  }

  openNewWindow(moduleName: ModuleNames, additionalPath = '') {
    const url =
      this.routesConfigService.modulePathConfig[moduleName] + additionalPath;
    window.open(url);
  }

  openFreddie() {
    this.openNewWindow(ModuleNames.LIVE_MESSAGING);
  }

  openViewReservation() {
    this.openNewWindow(ModuleNames.ADD_RESERVATION);
  }

  quickDropdownLink() {
    this.showQuickReservation();
  }

  get isSettingAvailable() {
    return !!this.subscriptionPlanService.settings?.length;
  }

  checkModuleSubscription(module) {
    return this.subscriptionPlanService.checkModuleSubscription(module);
  }

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }

  nightAuditCheckListener() {
    this.$subscription.add(
      this.nightAuditService.remainingAudit.subscribe((res) => {
        this.isNightAuditPending = !!res?.length;
      })
    );
  }

  selectedProductName: string;
  get selectedProduct() {
    this.selectedProductName = this.routesConfigService.productName;
    return this.subscriptionPlanService.getSelectedProductData(
      this.selectedProductName as ProductNames
    );
  }

  nightAuditCheck() {
    this.$subscription.add(
      this.nightAuditService
        .checkAudit(this.globalFilterService.entityId)
        .subscribe((res) => {
          this.nightAuditService.remainingAudit.next(res?.length ? res : []);
        })
    );
  }

  onQuickButtonClick() {
    this.subscriptionPlanService.show().isCalenderView
      ? this.showQuickReservation()
      : this.isGuestSubscribed
      ? this.showAddGuest()
      : this.showComplaint();
  }

  get getQuickLabel() {
    return this.subscriptionPlanService.show().isCalenderView
      ? 'Quick Booking'
      : this.isGuestSubscribed
      ? 'New Guest'
      : 'New Complaint';
  }

  get isPredictoSubscribed() {
    return (
      this.subscriptionPlanService.hasViewUserPermission({
        name: ProductNames.PREDICTO_PMS,
        type: 'product',
      }) &&
      this.subscriptionPlanService.checkProductSubscription(
        ProductNames.PREDICTO_PMS
      )
    );
  }

  get isComplaintTrackerSubscribed() {
    return this.subscriptionPlanService.checkProductSubscription(
      ModuleNames.COMPLAINT_TRACKER
    );
  }

  get isAddReservationSubscribed() {
    return (
      this.subscriptionPlanService.checkProductSubscription(
        ModuleNames.PREDICTO_PMS
      ) &&
      this.subscriptionPlanService.hasManageUserPermission(
        PermissionModuleNames.RESERVATION
      )
    );
  }

  get isGuestSubscribed() {
    return (
      this.subscriptionPlanService.checkModuleSubscription(
        ModuleNames.GUESTS
      ) &&
      this.subscriptionPlanService.hasManageUserPermission(
        PermissionModuleNames.MEMBERS
      )
    );
  }

  get isLiveMessagingSubscribed() {
    return (
      this.subscriptionPlanService.checkModuleSubscription(
        ModuleNames.LIVE_MESSAGING
      ) &&
      this.subscriptionPlanService.hasManageUserPermission(
        PermissionModuleNames.CONVERSATIONS
      )
    );
  }

  get isCreateWithSubscribed() {
    return this.subscriptionPlanService.checkProductSubscription(
      ModuleNames.CREATE_WITH
    );
  }

  get isQuickReservationAvailable() {
    return (
      this.subscriptionPlanService.checkModuleSubscription(
        ModuleNames.ADD_RESERVATION
      ) &&
      this.subscriptionPlanService.hasManageUserPermission(
        PermissionModuleNames.RESERVATION
      )
    );
  }

  // get selectedProduct() {
  //   return this.subscriptionPlanService.getSelectedProductData();
  // }
}
