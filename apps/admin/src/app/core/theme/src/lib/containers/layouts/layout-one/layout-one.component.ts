import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { UserService } from '@hospitality-bot/admin/shared';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { get } from 'lodash';
import { AuthService } from '../../../../../../auth/services/auth.service';
import { DateRangeFilterService } from '../../../services/daterange-filter.service';
import { FilterService } from '../../../services/filter.service';
import { GlobalFilterService } from '../../../services/global-filters.service';
import { FirebaseMessagingService } from '../../../services/messaging.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  backgroundColor: string;
  background_image: string;
  profile = [
    { label: 'Profile', value: 'profile' },
    { label: 'Logout', value: 'logout' },
  ];
  outlets = [];
  lastUpdatedAt: string;
  isGlobalFilterVisible: boolean = false;
  isDetailPageVisible: boolean = false;
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

  isGlobalSearchVisible: boolean = true;
  isProgressSpinner: boolean;

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
    private firebaseMessagingService: FirebaseMessagingService
  ) {}

  ngOnInit() {
    this.initLayoutConfigs();
    this.globalFilterService.listenForGlobalFilterChange();
    this.setInitialFilterValue();
    this.initSearchQueryForm();
    this.initFirebaseMessaging();
  }

  ngAfterContentInit() {
    this.isProgressSpinner = this.progressSpinnerService.isProgressSpinnerVisible;
  }

  initFirebaseMessaging() {
    this.firebaseMessagingService.requestPermission({
      hotelId: this._hotelDetailService.hotelDetails.brands[0].branches.filter(
        (d) => d.name === this.filterConfig.branchName
      )[0].id,
      userId: this._userService.getLoggedInUserid(),
    });
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
              this.firebaseMessagingService.showNotificationAsSnackBar(payload);
            }
            break;
        }
      }
    });
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
    const branches = this._hotelDetailService.hotelDetails?.brands[0]?.branches;
    this.outlets = get(this._hotelDetailService.hotelDetails, [
      'brands',
      '0',
      'branches',
      branches.length - 1,
      'outlets',
    ]);
    // console.log(outlets);
    this.filterConfig.brandName = get(this._hotelDetailService.hotelDetails, [
      'brands',
      '0',
      'label',
    ]);
    this.filterConfig.branchName = get(this._hotelDetailService.hotelDetails, [
      'brands',
      '0',
      'branches',
      branches.length - 1,
      'label',
    ]);
    this.filterService.emitFilterValue$.next({
      property: {
        hotelName: get(this._hotelDetailService.hotelDetails, [
          'brands',
          '0',
          'id',
        ]),
        branchName: get(this._hotelDetailService.hotelDetails, [
          'brands',
          '0',
          'branches',
          branches.length - 1,
          'id',
        ]),
      },
      feedback: {
        feedbackType: 'Transactional',
      },
      outlets: this.getOutletIds(),
    });
    this.timezone = get(this._hotelDetailService.hotelDetails, [
      'brands',
      '0',
      'branches',
      branches.length - 1,
      'timezone',
    ]);
    this.globalFilterService.timezone = this.timezone;
  }

  getOutletIds() {
    const outlets = {};
    this.outlets.forEach((d) => (outlets[d.id] = true));
    return outlets;
  }

  refreshDashboard() {
    let currentUrl = this._router.url;

    this._router.routeReuseStrategy.shouldReuseRoute = () => false;

    this._router.onSameUrlNavigation = 'reload';

    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
      this.lastUpdatedAt = DateService.getCurrentDateWithFormat('h:mm A');
    });
  }

  toggleGlobalFilter() {
    this.isGlobalFilterVisible = true;
    this.isGlobalSearchVisible = false;
  }

  switchVisibility() {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = true;
  }

  noFilterNoSearch() {
    this.isGlobalFilterVisible = false;
    this.isGlobalSearchVisible = false;
  }

  closeGlobalFilter() {
    this.isGlobalFilterVisible = false;
  }

  applyFilter(event) {
    const values = event.values;
    if (event.token.key) {
      const branch = this._hotelDetailService.hotelDetails.brands[0].branches.filter(
        (d) => d.id === values.property.branchName
      )[0];
      this.filterConfig.branchName = branch.name;
      this.timezone = branch.timezone;
      this.globalFilterService.timezone = branch.timezone;
      localStorage.setItem(event.token.key, event.token.value);
    }
    this.filterService.emitFilterValue$.next(values);
    this.resetFilterCount();
    this.getFilterCount({ ...values });
    this.initFirebaseMessaging();
    this.toggleGlobalFilter();
    this.isGlobalFilterVisible = false;
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
    let filterObj = event;
    for (let key in filterObj) {
      if (
        !Array.isArray(filterObj[key]) &&
        filterObj[key] &&
        filterObj[key].constructor.name != 'Object'
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
      case 'profile':
        this.displayProfile();
        break;
      case 'logout':
        this.logoutUser();
        break;
      default:
        return;
    }
  }

  displayProfile() {
    this._router.navigate([
      `/pages/roles-permissions/${this._userService.getLoggedInUserid()}`,
    ]);
  }

  logoutUser() {
    this._authService.logout(this._userService.getLoggedInUserid()).subscribe(
      (response) => {
        this._authService.clearToken();
        this._router.navigate(['/auth']);
        location.reload();
      },
      (error) => {
        this._authService.clearToken();
        this._router.navigate(['/auth']);
        location.reload();
      }
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

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }
}
