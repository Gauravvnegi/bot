import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { DateService } from '@hospitality-bot/shared/utils';
import { get } from 'lodash';
import { Subscription } from 'rxjs';
import { ModuleNames } from '../../../../../../../../../../../libs/admin/shared/src/lib/constants/subscriptionConfig';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { layoutConfig } from '../../../constants/layout';
import { DateRangeFilterService } from '../../../services/daterange-filter.service';
import { FilterService } from '../../../services/filter.service';
import { GlobalFilterService } from '../../../services/global-filters.service';
import { FirebaseMessagingService } from '../../../services/messaging.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';
import { SubscriptionPlanService } from '../../../services/subscription-plan.service';
import { trigger, transition, animate, style } from '@angular/animations';
import { LoadingService } from '../../../services/loader.service';

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
  profile = layoutConfig.profile;
  outlets = [];
  lastUpdatedAt: string;
  isGlobalFilterVisible = false;
  isDetailPageVisible = false;
  searchFG: FormGroup;
  timezone: string;
  filterConfig = {
    brandName: '',
    branchName: '',
    totalFilters: 0,
    totalFilterContent: function () {
      return this.totalFilters <= 0 ? '' : `(+${this.totalFilters}) Others`;
    },
  };
  private $firebaseMessagingSubscription = new Subscription();
  isGlobalSearchVisible = true;

  constructor(
    private _router: Router,
    public filterService: FilterService,
    public dateRangeFilterService: DateRangeFilterService,
    public progressSpinnerService: ProgressSpinnerService,
    public globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private _authService: AuthService,
    private _userService: UserService,
    private fb: FormBuilder,
    private firebaseMessagingService: FirebaseMessagingService,
    private subscriptionPlanService: SubscriptionPlanService,
    private loadingService: LoadingService
  ) {
    this.initSearchQueryForm();
  }

  ngOnInit() {
    this.initLayoutConfigs();
    this.globalFilterService.listenForGlobalFilterChange();
    this.setInitialFilterValue();
    this.loadingService.close();
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

  initSearchQueryForm(): void {
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
    const branches = brand?.branches;
    const branch = get(branches, [branches.length - 1]);
    this.outlets = branch?.outlets;
    this.filterConfig.brandName = brand?.label;
    this.filterConfig.branchName = branch?.label;
    this.filterService.emitFilterValue$.next({
      property: {
        hotelName: brand?.id,
        branchName: branch?.id,
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
    this.initFirebaseMessaging(branch?.id);
    this.globalFilterService.timezone = this.timezone = branch?.timezone;
    this.globalFilterService.hotelId = branch?.id;
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
    el.scrollTop = 0;
  }

  enableGlobalSearch() {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = true;
  }

  disableFilter() {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = false;
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
      this.globalFilterService.hotelId = branch.id;
      console.log(this.globalFilterService.hotelId);
    }
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

  profileAction(event) {
    const itemType = event;

    switch (itemType) {
      case layoutConfig.userDropdown.profile:
        this.displayProfile();
        break;
      case layoutConfig.userDropdown.logout:
        this.logoutUser();
        break;
      default:
        return;
    }
  }

  displayProfile() {
    if (
      this.subscriptionPlanService.getModuleSubscription().modules[
        ModuleNames.ROLE_MANAGEMENT
      ].active
    )
      this._router.navigate([
        `/pages/${
          ModuleNames.ROLE_MANAGEMENT
        }/${this._userService.getLoggedInUserid()}`,
      ]);
  }

  logoutUser() {
    this._authService
      .logout(this._userService.getLoggedInUserid())
      .subscribe(() => {
        this.firebaseMessagingService.destroySubscription();
        this._authService.clearToken();
        location.reload();
      });
  }

  checkForTransactionFeedbackSubscribed() {
    const subscription = this.subscriptionPlanService.getModuleSubscription();
    return get(subscription, [
      'modules',
      ModuleNames.FEEDBACK_TRANSACTIONAL,
      'active',
    ]);
  }

  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    if (document.hidden) {
      this.firebaseMessagingService.tabActive.next(false);
    } else if (this._router.url.includes('messages')) {
      this.firebaseMessagingService.tabActive.next(true);
    }
  }

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }
}
