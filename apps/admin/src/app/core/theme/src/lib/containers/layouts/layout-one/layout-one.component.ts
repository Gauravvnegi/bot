import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
    private configService: ConfigService
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
      hotelId: entityId,
      userId: this._userService.getLoggedInUserId(),
    };
    this.firebaseMessagingService.requestPermission(requestPermissionData);
    this.$firebaseMessagingSubscription.add(
      this.firebaseMessagingService.receiveMessage().subscribe((payload) => {
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
              if (this._router.url.includes('request'))
                this.firebaseMessagingService.newInhouseRequest.next(
                  notificationPayload
                );
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
    const selectedHotelId = this._hotelDetailService.hotelId;
    const selectedHotelData = this._hotelDetailService.hotels.find(
      (item) => item.id === selectedHotelId
    );
    const selectedBrandId = this._hotelDetailService.brandId;
    const selectedBrandData = this._hotelDetailService.brands.find(
      (item) => item.id === selectedBrandId
    );

    this.logoUrl = selectedHotelData?.['logoUrl'];
    this.bgColor = selectedHotelData?.['headerBgColor'];
    this.outlets = selectedHotelData?.['outlets'] ?? [];
    this.filterConfig.brandName = selectedBrandData?.['name'];
    this.filterConfig.branchName = selectedHotelData?.['name'];
    this.filterService.emitFilterValue$.next({
      property: {
        hotelName: selectedBrandData?.['id'],
        branchName: selectedHotelData?.['id'],
      },
      feedback: {
        feedbackType: this.checkForTransactionFeedbackSubscribed()
          ? layoutConfig.feedback.transactional
          : layoutConfig.feedback.stay,
      },
      outlets: this.outlets.reduce(
        (acc, curr) => ((acc[curr.id] = true), acc),
        {}
      ),
    });
    this.initFirebaseMessaging(selectedHotelData?.['id']);
    this.timezone = selectedHotelData?.['timezone'];
    this.globalFilterService.timezone = this.timezone;
    this.globalFilterService.hotelId = selectedHotelId;
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
    const hotelId = values.property.branchName;
    const brandId = values.property.hotelName;
    if (event.token.key && event.token.value && hotelId && brandId) {
      /**
       * Update business session will update the local storage and reload to reset the data
       */
      this._hotelDetailService.updateBusinessSession({
        [tokensConfig.accessToken]: event.token.value,
        [tokensConfig.hotelId]: hotelId,
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

  checkForTransactionFeedbackSubscribed() {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.FEEDBACK_TRANSACTIONAL
    );
  }

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

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }

  get isCreateWithSubscribed() {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.CREATE_WITH
    );
  }
}
