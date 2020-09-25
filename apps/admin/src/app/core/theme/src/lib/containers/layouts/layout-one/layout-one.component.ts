import { Component, OnInit, ComponentRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { FilterService } from '../../../services/filter.service';
import { DateRangeFilterService } from '../../../services/daterange-filter.service';
import { ProgressSpinnerService } from '../../../services/progress-spinner.service';
@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  backgroundColor: string;
  background_image: string;
  profile: MenuItem[] = [
    { label: 'Profile', icon: 'person' },
    { label: 'Logout', icon: 'person_remove' },
  ];
  lastUpdatedAt: string;
  isGlobalFilterVisible: boolean = false;

  constructor(
    private _router: Router,
    public dateService: DateService,
    public filterService: FilterService,
    public dateRangeFilterService: DateRangeFilterService,
    public progressSpinnerService: ProgressSpinnerService
  ) {}

  ngOnInit() {
    this.initLayoutConfigs();
  }

  initLayoutConfigs() {
    this.backgroundColor = 'white';
    this.lastUpdatedAt = this.dateService.getCurrentDateWithFormat('h:mm A');
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
    this.toggleGlobalFilter();
  }

  resetFilter(event) {
    this.filterService.emitFilterValue$.next(event);
    this.toggleGlobalFilter();
  }

  applyDateRangeFilter(event) {
    this.dateRangeFilterService.emitDateRangeFilterValue$.next(event);
  }
}
