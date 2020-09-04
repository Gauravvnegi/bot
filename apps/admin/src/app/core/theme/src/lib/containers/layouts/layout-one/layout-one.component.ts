import { Component, OnInit, ComponentRef } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public backgroundColor: string;
  public background_image: string;
  dashBoardComp: ComponentRef<any>;

  constructor(private _router: Router) {}

  ngOnInit() {
    this.initLayoutConfigs();
    // this.Profile = [
    //   { label: 'Profile', icon: 'person' },
    //   { label: 'Logout', icon: 'person_remove' },
    // ];
  }

  initLayoutConfigs() {
    this.backgroundColor = '#0483f4';
  }

  onRouteChanged(event: ComponentRef<any>) {
    this.dashBoardComp = event;
  }

  refreshDashboard() {
    debugger;
    this.dashBoardComp.destroy();
    // this.dashBoardComp;
    // this._router.navigate(['/pages/dashboard']);
  }
}
