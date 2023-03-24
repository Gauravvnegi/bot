import { animate, style, transition, trigger } from '@angular/animations';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService, UserService } from '@hospitality-bot/admin/shared';
import { DateService } from '@hospitality-bot/shared/utils';
import { ModuleNames } from 'libs/admin/shared/src/lib/constants/subscriptionConfig';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
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
    private notificatonService: NotificationService,
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
      userId: this._userService.getLoggedInUserid(),
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
    const brand = get(this._hotelDetailService.hotelDetails, ['brands', '0']);
    const branches = brand?.['branches'];

    // Selecting the last available branch(hotel) in login details
    let branch = get(branches, [branches.length - 1]);

    // Updating the branch if it is in local storage
    const selectedBranch = localStorage.getItem('hotelId');
    if (selectedBranch) {
      const currentBranch = branches.find((item) => item.id === selectedBranch);
      if (currentBranch) branch = currentBranch;
    } else localStorage.setItem('hotelId', branch?.['id']);

    this.logoUrl = branch?.['logoUrl'];
    this.bgColor = branch?.['headerBgColor'];
    this.outlets = branch?.['outlets'];
    this.filterConfig.brandName = brand?.['label'];
    this.filterConfig.branchName = branch?.['label'];
    this.filterService.emitFilterValue$.next({
      property: {
        hotelName: brand?.['id'],
        branchName: branch?.['id'],
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
    this.initFirebaseMessaging(branch?.['id']);
    this.timezone = get(brand, ['branches', branches.length - 1, 'timezone']);
    this.globalFilterService.timezone = this.timezone;
    this.globalFilterService.hotelId = branch?.['id'];
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
    this.filterService.emitFilterValue$.next(values);
    this.resetFilterCount();
    this.getFilterCount({ ...values });
    this.isGlobalFilterVisible = false;
    if (event.token.key) {
      const branch = this._hotelDetailService.hotelDetails.brands
        .filter((brand) => brand.id === values.property.hotelName)[0]
        .branches.filter((d) => d.id === values.property.branchName)[0];
      this.filterConfig.branchName = branch.name;
      this.globalFilterService.timezone = this.timezone = branch.timezone;
      localStorage.setItem(event.token.key, event.token.value);
      this.$firebaseMessagingSubscription.unsubscribe();
      this.initFirebaseMessaging(values.property.branchName);
      this.globalFilterService.hotelId = branch?.['id'];
    }
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
    this.notificatonService
      .getUnreadCount(this._userService.getLoggedInUserid())
      .subscribe((response) => (this.unreadCount = response?.unreadCount));
  }

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }
}
