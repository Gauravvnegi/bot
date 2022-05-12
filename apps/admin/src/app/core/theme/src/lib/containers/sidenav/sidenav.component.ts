import { Component, OnInit, OnDestroy } from '@angular/core';
import { ADMIN_ROUTES, DEFAULT_ROUTES } from './sidenav-admin.routes';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { OrientationPopupComponent } from '../orientation-popup/orientation-popup.component';
import { GlobalFilterService } from '../../services/global-filters.service';
import { Subscription } from 'rxjs';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { ModuleNames } from '../../../../../../../../../../libs/admin/shared/src/lib/constants/subscriptionConfig';

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
      const checkSubscriptionData = this.subscriptionCheck(data, subscription);
      if (checkSubscriptionData.length) {
        this.menuItems.push(
          checkSubscriptionData[0].children ? checkSubscriptionData[0] : data
        );
      }
    });
    this.menuItems = [
      ...new Map(
        [...this.menuItems, ...DEFAULT_ROUTES].map((item) => [item.path, item])
      ).values(),
    ];
  }

  toggleMenuButton() {
    this.status = !this.status;
    this.isExpanded = !this.isExpanded;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  subscriptionCheck(data, subscription) {
    switch (data.path) {
      case ModuleNames.FEEDBACK:
        return subscription.filter(
          (d) =>
            (ModuleNames[d.name] === data.path && d.active) ||
            (ModuleNames.FEEDBACK_TRANSACTIONAL === d.name && d.active)
        );
      case 'conversation':
        const subItemList = this.checkConversationSubscription(
          data,
          subscription
        );
        return subItemList.length ? [{ ...data, children: subItemList }] : [];
      case ModuleNames.MARKETING:
        return this.checkSubscriptionByPath(
          ModuleNames.MARKETING,
          subscription
        );
      case 'library':
        const libraryList = this.checkLibraryItems(data, subscription);
        return libraryList.length ? [{ ...data, children: libraryList }] : [];
      default:
        return subscription.filter(
          (d) => ModuleNames[d.name] == data.path && d.active
        );
    }
  }

  checkConversationSubscription(item, subscription) {
    const subItemList = [];
    item.children.forEach((child) => {
      if (
        child.path.includes('request') &&
        this.checkSubscriptionByPath(ModuleNames.REQUEST, subscription).length
      ) {
        subItemList.push(child);
      } else if (!child.path.includes('request')) subItemList.push(child);
    });
    return subItemList;
  }

  checkLibraryItems(item, subscription) {
    const subItemList = [];
    item.children.forEach((child) => {
      switch (child.path) {
        case 'library/package':
          if (
            this.checkSubscriptionByPath(ModuleNames.PACKAGES, subscription)
              .length
          )
            subItemList.push(child);
          break;
        case 'library/listing':
          if (
            this.checkSubscriptionByPath(ModuleNames.MARKETING, subscription)
              .length
          )
            subItemList.push(child);
          break;
        case 'library/topic':
          if (
            this.checkSubscriptionByPath(ModuleNames.MARKETING, subscription)
              .length
          )
            subItemList.push(child);
          break;
        case 'library/template':
          if (
            this.checkSubscriptionByPath(ModuleNames.MARKETING, subscription)
              .length
          )
            subItemList.push(child);
          break;
        case 'library/assets':
          if (
            this.checkSubscriptionByPath(ModuleNames.MARKETING, subscription)
              .length ||
            this.checkSubscriptionByPath(ModuleNames.PACKAGES, subscription)
              .length
          )
            subItemList.push(child);
          break;
      }
    });
    return subItemList;
  }

  checkSubscriptionByPath(path, subscription) {
    return subscription.filter((d) => ModuleNames[d.name] === path && d.active);
  }
}
