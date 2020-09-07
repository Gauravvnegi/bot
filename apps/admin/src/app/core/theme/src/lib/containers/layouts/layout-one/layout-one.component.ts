import { Component, OnInit, ComponentRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DateService } from 'libs/shared/utils/src/lib/date.service';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public backgroundColor: string;
  public background_image: string;
  profile: MenuItem[];
  lastUpdatedAt: string;
  constructor(private _router: Router, public dateService: DateService) {}

  ngOnInit() {
    this.initLayoutConfigs();
    this.profile = [
      { label: 'Profile', icon: 'person' },
      { label: 'Logout', icon: 'person_remove' },
    ];
  }

  initLayoutConfigs() {
    this.backgroundColor = '#0483f4';
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
    });

    this._router.onSameUrlNavigation = 'ignore';

    //this.dashBoardComp.destroy();
    // this.dashBoardComp;
    // this._router.navigate(['/pages/dashboard'],{ queryParams: { 'refresh': 1 } });
    //let currentUrl = this._router.url;
    // this._router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //   this._router.navigate([currentUrl]);
    // });
  }
}
