import { Component, OnInit } from '@angular/core';
import { ADMIN_ROUTES } from './sidenav-admin.routes';
// import { SUPER_ADMIN_ROUTES } from './sidenav-admin.routes';

@Component({
  selector: 'hospitality-bot-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
  public list_item_colour: string;
  public menuItems: object;
  public activeFontColor: string;
  public normalFontColor: string;
  public dividerBgColor: string;
  isExpanded: boolean = true;
  status: boolean = false;

  constructor() {}

  ngOnInit() {
    this.initSideNavConfigs();
  }

  private initSideNavConfigs() {
    this.activeFontColor = 'rgba(0,0,0,.6)';
    this.normalFontColor = 'rgba(255,255,255,.8)';
    this.dividerBgColor = 'rgba(255, 255, 255, 0.5)';
    this.list_item_colour = '#fff';
    //check if admin or super admin by using command pattern
    this.menuItems = ADMIN_ROUTES;
  }

  toggleMenuButton() {
    this.status = !this.status;
    this.isExpanded = !this.isExpanded;
  }
}
