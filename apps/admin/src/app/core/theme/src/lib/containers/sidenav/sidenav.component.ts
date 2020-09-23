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
  public headerBgColor: string;
  isExpanded: boolean = true;
  status: boolean = false;

  constructor() {}

  ngOnInit() {
    this.initSideNavConfigs();
    console.log('========sidenav');
  }

  private initSideNavConfigs() {
    this.activeFontColor = '#4B56C0';
    this.normalFontColor = '#C5C5C5';
    this.dividerBgColor = 'white';
    this.list_item_colour = '#E8EEF5';
    this.headerBgColor='#4B56C0';
    //check if admin or super admin by using command pattern
    this.menuItems = ADMIN_ROUTES;
  }

  toggleMenuButton() {
    this.status = !this.status;
    this.isExpanded = !this.isExpanded;
  }
}
