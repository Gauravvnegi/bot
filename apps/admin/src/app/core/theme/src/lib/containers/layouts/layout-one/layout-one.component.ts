import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
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
  lastUpdatedAt: string;
  isGlobalFilterVisible: boolean = false;
  isDetailPageVisible: boolean = false;
  searchFG: FormGroup;
  filterConfig = {
    brandName: '',
    branchName: '',
    totalFilters: 0,
    totalFilterContent: function () {
      return this.totalFilters <= 0 ? '' : `(+${this.totalFilters}) Others`;
    },
  };

  isGlobalSearchVisible: boolean = true;

  constructor(
    private _router: Router,
    public filterService: FilterService,
    public dateRangeFilterService: DateRangeFilterService,
    public progressSpinnerService: ProgressSpinnerService,
    public globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private _authService: AuthService,
    private _userDetailService: UserDetailService,
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

  initFirebaseMessaging() {
    this.firebaseMessagingService.requestPermission({
      hotelId: get(this._hotelDetailService.hotelDetails, [
        'brands',
        '0',
        'branches',
        '0',
        'id',
      ]),
      userId: this._userDetailService.getLoggedInUserid(),
    });
    this.firebaseMessagingService.receiveMessage().subscribe((payload) => {
      console.log('new message received. ', payload);
      if (this.checkForMessageRoute())
        this.firebaseMessagingService.currentMessage.next(payload);
      else {
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
    this.filterConfig.brandName = get(this._hotelDetailService.hotelDetails, [
      'brands',
      '0',
      'label',
    ]);
    this.filterConfig.branchName = get(this._hotelDetailService.hotelDetails, [
      'brands',
      '0',
      'branches',
      '0',
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
          '0',
          'id',
        ]),
      },
    });
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
      this.filterConfig.branchName = this._hotelDetailService.hotelDetails.brands[0].branches.filter(
        (d) => d.id === values.property.branchName
      )[0].name;
      localStorage.setItem(event.token.key, event.token.value);
    }
    this.filterService.emitFilterValue$.next(values);
    this.resetFilterCount();
    this.getFilterCount({ ...values });
    this.toggleGlobalFilter();
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
      `/pages/roles-permissions/${this._userDetailService.getLoggedInUserid()}`,
    ]);
  }

  logoutUser() {
    this._authService.clearToken();
    this._router.navigate(['/auth']);
  }

  ngOnDestroy() {
    this.firebaseMessagingService.destroySubscription();
  }
}
