import { Component, OnInit, OnDestroy } from '@angular/core';
import { ADMIN_ROUTES, DEFAULT_ROUTES } from './sidenav-admin.routes';
// import { SUPER_ADMIN_ROUTES } from './sidenav-admin.routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { OrientationPopupComponent } from '../orientation-popup/orientation-popup.component';
import { GlobalFilterService } from '../../services/global-filters.service';
import { Subscription } from 'rxjs';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { FeatureNames } from '../../../../../../../../../../libs/shared/constants/subscriptionConfig';

@Component({
  selector: 'hospitality-bot-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  public list_item_colour: string;
  public menuItems = [];
  public activeFontColor: string;
  public normalFontColor: string;
  public dividerBgColor: string;
  public headerBgColor: string;
  isExpanded: boolean = true;
  status: boolean = false;
  $subscription = new Subscription();
  branchConfig;
  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _modal: ModalService,
    private _globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit() {
    this.registerListeners();
    this.getSubscriptionPlan({
      headerBgColor: this.branchConfig.headerBgColor,
    });
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.toggleSidenavForTablet();
    this.listenForTabPortrait();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        const { hotelName: brandId, branchName: branchId } = data[
          'filter'
        ].value.property;

        const brandConfig = this._hotelDetailService.hotelDetails.brands.find(
          (brand) => brand.id == brandId
        );
        this.branchConfig = brandConfig.branches.find(
          (branch) => branch.id == branchId
        );
      })
    );
  }

  toggleSidenavForTablet() {
    this.$subscription.add(
      this._breakpointObserver.observe([Breakpoints.Web]).subscribe((res) => {
        if (!res.matches) {
          this.toggleMenuButton();
        } else if (!this.isExpanded) {
          this.toggleMenuButton();
        }
      })
    );
  }

  listenForTabPortrait() {
    this.$subscription.add(
      this._breakpointObserver
        .observe([Breakpoints.TabletPortrait])
        .subscribe((res) => {
          if (res.matches) {
            this.openOrientationPopup();
          }
        })
    );
  }

  openOrientationPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '450px';
    this._modal.openDialog(OrientationPopupComponent, dialogConfig);
  }

  getSubscriptionPlan(config) {
    this.initSideNavConfigs(
      this.subscriptionPlanService.getSubscription()['features'].MODULE,
      config
    );
  }

  private initSideNavConfigs(subscription, config = {}) {
    this.activeFontColor = '#4B56C0';
    this.normalFontColor = '#C5C5C5';
    this.dividerBgColor = 'white';
    this.list_item_colour = '#E8EEF5';
    this.headerBgColor = config['headerBgColor'] || '#4B56C0';
    //check if admin or super admin by using command pattern
    ADMIN_ROUTES.forEach((data, i) => {
      if (
        subscription.filter(
          (d) => FeatureNames[d.name] === data.path && d.active
        ).length
      ) {
        if (this.menuItems.filter((d) => d.path === data.path).length === 0) {
          this.menuItems.push(data);
        }
      }
      if (i === ADMIN_ROUTES.length - 2) {
        this.menuItems = [...this.menuItems, ...DEFAULT_ROUTES];
      }
    });
  }

  toggleMenuButton() {
    this.status = !this.status;
    this.isExpanded = !this.isExpanded;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
