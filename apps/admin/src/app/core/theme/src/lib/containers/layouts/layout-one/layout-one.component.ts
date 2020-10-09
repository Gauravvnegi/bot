import { Component, OnInit, ComponentRef } from '@angular/core';
import {
  RouterOutlet,
  Router,
  NavigationStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { FilterService } from '../../../services/filter.service';
import { DateRangeFilterService } from '../../../services/daterange-filter.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { GlobalFilterService } from '../../../services/global-filters.service';

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
  filterConfig = {
    brandName: '',
    branchName: '',
    totalFilters: 0,
    totalFilterContent: function () {
      return this.totalFilters <= 0 ? '' : `(+${this.totalFilters}) Others`;
    },
  };
  constructor(
    private _router: Router,
    public dateService: DateService,
    public filterService: FilterService,
    public dateRangeFilterService: DateRangeFilterService,
    public progressSpinnerService: ProgressSpinnerService,
    public globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService
  ) {}

  ngOnInit() {
    this.initLayoutConfigs();
    this.globalFilterService.listenForGlobalFilterChange();
    this.setInitialFilterValue();
  }

  initLayoutConfigs() {
    this.backgroundColor = 'white';
    this.lastUpdatedAt = this.dateService.getCurrentDateWithFormat('h:mm A');
  }

  setInitialFilterValue() {
    this.filterConfig.brandName = this._hotelDetailService.hotelDetails.brands[0].label;
    this.filterConfig.branchName = this._hotelDetailService.hotelDetails.brands[0].branches[0].label;
    this.filterService.emitFilterValue$.next({
      property: {
        hotelName: this._hotelDetailService.hotelDetails.brands[0].id,
        branchName: this._hotelDetailService.hotelDetails.brands[0].branches[0]
          .id,
      },
    });
  }

  refreshDashboard() {
    let currentUrl = this._router.url;

    this._router.routeReuseStrategy.shouldReuseRoute = () => false;

    this._router.onSameUrlNavigation = 'reload';

    // this._router.navigate([currentUrl], {
    //   queryParams: { refresh: 1 },
    //   skipLocationChange: true,
    // });

    this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this._router.navigate([currentUrl]);
      this.lastUpdatedAt = this.dateService.getCurrentDateWithFormat('h:mm A');
      // this._router.routeReuseStrategy.shouldReuseRoute = () => true;
      // this._router.onSameUrlNavigation = 'reload';
    });

    // this._router.onSameUrlNavigation = 'ignore';

    //this.dashBoardComp.destroy();
    // this.dashBoardComp;
    // this._router.navigate(['/pages/dashboard'],{ queryParams: { 'refresh': 1 } });
    //let currentUrl = this._router.url;
    // this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this._router.navigate([currentUrl]);
    // });
  }

  toggleGlobalFilter() {
    this.isGlobalFilterVisible = !this.isGlobalFilterVisible;
  }

  applyFilter(event) {
    this.filterService.emitFilterValue$.next(event);
    this.resetFilterCount();
    this.getFilterCount({ ...event });
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
}
