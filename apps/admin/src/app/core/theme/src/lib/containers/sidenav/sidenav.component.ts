import { Component, OnInit } from '@angular/core';
import { ADMIN_ROUTES } from './sidenav-admin.routes';
// import { SUPER_ADMIN_ROUTES } from './sidenav-admin.routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { OrientationPopupComponent } from '../orientation-popup/orientation-popup.component';

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

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _modal: ModalService
  ) {}

  ngOnInit() {
    this.initSideNavConfigs();
    this.registerListeners();
  }

  registerListeners() {
    this.toggleSidenavForTablet();
    this.listenForTabPortrait();
  }

  toggleSidenavForTablet() {
    this._breakpointObserver.observe([Breakpoints.Web]).subscribe((res) => {
      if (!res.matches) {
        this.toggleMenuButton();
      } else if (!this.isExpanded) {
        this.toggleMenuButton();
      }
    });
  }

  listenForTabPortrait() {
    this._breakpointObserver
      .observe([Breakpoints.TabletPortrait])
      .subscribe((res) => {
        if (res.matches) {
          this.openOrientationPopup();
        }
      });
  }

  openOrientationPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '450px';
    this._modal.openDialog(OrientationPopupComponent, dialogConfig);
  }

  private initSideNavConfigs() {
    this.activeFontColor = '#4B56C0';
    this.normalFontColor = '#C5C5C5';
    this.dividerBgColor = 'white';
    this.list_item_colour = '#E8EEF5';
    this.headerBgColor = '#4B56C0';
    //check if admin or super admin by using command pattern
    this.menuItems = ADMIN_ROUTES;
  }

  toggleMenuButton() {
    this.status = !this.status;
    this.isExpanded = !this.isExpanded;
  }
}
