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
  ProductMenu,
  routes,
} from '../../../../../../../../../../libs/admin/shared/src/index';
import { MenuItem } from '../../data-models/menu.model';
import { GlobalFilterService } from '../../services/global-filters.service';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { OrientationPopupComponent } from '../orientation-popup/orientation-popup.component';
import { AuthService } from '../../../../../auth/services/auth.service';

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
  isMenuBarVisible: boolean = false;
  productList = [];
  selectedProduct: ModuleNames;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _modal: ModalService,
    private globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private subscriptionPlanService: SubscriptionPlanService,
    private router: Router,
    private authService: AuthService
  ) {
    this.router.events.subscribe((res: any) => {
      // For the first time product find if
      if (this.selectedProduct) return;

      if (res?.urlAfterRedirects && res.urlAfterRedirects.includes('/pages')) {
        for (let moduleName in routes) {
          if (
            routes[moduleName] === res.urlAfterRedirects.split('/pages/')[1]
          ) {
            const productMapping = this.subscriptionPlanService.getModuleProductMapping();
            this.selectedProduct = productMapping[moduleName];
            // set setting based on product
          }
        }
      }
    });
  }

  ngOnInit() {
    // this.selectedProduct = this.authService.getTokenByName(
    //   'selectedProduct'
    // ) as ModuleNames;
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
        const { brandName: brandId, entityName: branchId } = data[
          'filter'
        ].value.property;

        const brandConfig = this._hotelDetailService.brands.find(
          (brand) => brand.id === brandId
        );
        this.branchConfig = brandConfig.entities.find(
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
    this.selectedModule = this.menuItems.find((item) => {
      const paths = this.router.url.split('/');
      return paths.includes(item?.path);
    })?.name;
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
  products;
  private initSideNavConfigs(config = {}) {
    this.activeFontColor = '#ffffff';
    this.normalFontColor = '#ffffff';
    this.dividerBgColor = 'white';
    this.list_item_colour = '#E8EEF5';
    this.headerBgColor = config['headerBgColor'] || '#4B56C0';
    this.products = this.subscriptionPlanService.getSubscription()['products'];

    this.productList = this.products
      .filter((item) => item.isView)
      .map((product) => {
        let menuItem = new MenuItem().deserialize(product);
        return menuItem;
      });

    const selectedModule = this.selectedProduct
      ? this.productList.find((item) => item.name === this.selectedProduct)
      : this.productList.find((item) => item.isSubscribed);

    if (selectedModule) {
      this.selectedProduct = selectedModule.name;
      this.subscriptionPlanService.selectedProduct = this.selectedProduct;
      this.menuItems = selectedModule.children;
    }

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

  // Intial -> Selected Product (priority sequence)
  // IsView

  onMenuCLick(data: any) {
    this.selectedProduct = data.name;

    this.subscriptionPlanService.selectedProduct = this.selectedProduct;

    if (data.isSubscribed) {
      this.menuItems = data.children;
      this.setSelectedModuleBasedOnRoute();
      //route to first child of first product
      const childRoute = data.children
        .find((item) => item.isView && item.isSubscribed)
        ?.children?.find((item) => item.isView && item.isSubscribed);

      this.router.navigate([`pages/${routes[childRoute.name]}`], {
        replaceUrl: true,
      });
    } else {
      this.menuItems = [];
      this.router.navigate([`pages/redirect`]);
    }

    this.subscriptionPlanService.setSettings();
    this.isMenuBarVisible = false;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  isSameModule(path: string) {
    const paths = this.router.url.split('/');
    return paths.includes(path);
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

  onExplore() {
    this.isMenuBarVisible = !this.isMenuBarVisible;
  }
}
