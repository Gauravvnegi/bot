import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import {
  ModuleNames,
  routes,
} from '../../../../../../../../../../libs/admin/shared/src/index';
import { MenuItem } from '../../data-models/menu.model';
import { GlobalFilterService } from '../../services/global-filters.service';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { OrientationPopupComponent } from '../orientation-popup/orientation-popup.component';

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
  @Input() isExpanded: boolean = false;
  status = true;
  $subscription = new Subscription();
  branchConfig;
  menuItemChildren = [];
  @Output() submenuItems = new EventEmitter<any>();
  @Output() navToggle = new EventEmitter<boolean>();
  selectedModule: ModuleNames;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _modal: ModalService,
    private globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private subscriptionPlanService: SubscriptionPlanService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerListeners();
    this.initSideNavConfigs({
      headerBgColor: this.branchConfig.headerBgColor,
    });
  }

  registerListeners() {
    this.listenForGlobalFilters();
    this.toggleSidenavForTablet();
    this.listenForTabPortrait();
    this.listenToRouteChange();
  }

  listenToRouteChange() {
    this.router.events.subscribe((res) => {
      this.setSelectedModuleBasedOnRoute();
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.selectedModule.subscribe((name) => {
        if (name) {
          this.selectedModule = name;
        } else {
          this.setSelectedModuleBasedOnRoute();
        }
      })
    );
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        const { hotelName: brandId, branchName: branchId } = data[
          'filter'
        ].value.property;

        const brandConfig = this._hotelDetailService.hotelDetails.brands.find(
          (brand) => brand.id === brandId
        );
        this.branchConfig = brandConfig.branches.find(
          (branch) => branch.id === branchId
        );
      })
    );
  }

  toggleSidenavForTablet() {
    this.$subscription.add(
      this._breakpointObserver.observe([Breakpoints.Web]).subscribe((res) => {
        if (!res.matches) {
          this.toggleMenuButton();
        }
      })
    );
  }

  setSelectedModuleBasedOnRoute() {
    this.selectedModule = this.menuItems.find((item) =>
      this.router.url.includes(item?.path)
    )?.name;
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

  private initSideNavConfigs(config = {}) {
    this.activeFontColor = '#ffffff';
    this.normalFontColor = '#ffffff';
    this.dividerBgColor = 'white';
    this.list_item_colour = '#E8EEF5';
    this.headerBgColor = config['headerBgColor'] || '#4B56C0';
    let products = this.subscriptionPlanService.getSubscription()['products'];

    this.menuItems = products
      .filter((item) => item.isView)
      .map((product) => {
        let menuItem = new MenuItem().deserialize(product);
        return menuItem;
      });

    this.setSelectedModuleBasedOnRoute();
  }

  toggleMenuButton(menuItem?: MenuItem) {
    if (menuItem?.name === ModuleNames.SETTINGS) {
      this.router.navigate([`/pages/${routes.SETTINGS}`]);
    }
    this.globalFilterService.selectedModule.next(menuItem?.name ?? '');
    this.isExpanded = !this.isExpanded;
    this.navToggle.emit(this.isExpanded);
  }

  subSideNav(title: string, items: any) {
    const data = {
      title: title,
      list: items,
    };
    this.submenuItems.emit(data);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  isSameModule(path: string) {
    return this.router.url.includes(path);
  }

  handleRouteChange(menuItem) {
    this.globalFilterService.selectedModule.next(menuItem.name);
    this.isExpanded =
      menuItem.children && menuItem.children.length ? true : false;
    this.navToggle.emit(this.isExpanded);
    this.subSideNav(menuItem.title, menuItem.children);
  }

  handleRouteChangeOnLeave() {
    if (!this.isExpanded) {
      this.setSelectedModuleBasedOnRoute();
    }
  }
}
