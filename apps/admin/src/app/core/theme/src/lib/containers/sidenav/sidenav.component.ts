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
import { Router, NavigationEnd } from '@angular/router';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import {
  ModuleNames,
  ProductMenu,
  ProductNames,
  routes,
} from '../../../../../../../../../../libs/admin/shared/src/index';
import {
  Product,
  ProductItem,
  SubMenuItem,
} from '../../data-models/menu.model';
import { GlobalFilterService } from '../../services/global-filters.service';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { OrientationPopupComponent } from '../orientation-popup/orientation-popup.component';
import { AuthService } from '../../../../../auth/services/auth.service';
import {
  ActiveRouteConfig,
  RoutesConfigService,
} from '../../services/routes-config.service';

@Component({
  selector: 'hospitality-bot-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit, OnDestroy {
  public list_item_colour: string;
  public menuItems: SubMenuItem[] = [];
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
  productList: ProductItem[] = [];
  selectedProduct: ProductNames;
  isImageLoaded: boolean = false;

  constructor(
    private _breakpointObserver: BreakpointObserver,
    private _modal: ModalService,
    private globalFilterService: GlobalFilterService,
    private _hotelDetailService: HotelDetailService,
    private subscriptionPlanService: SubscriptionPlanService,
    private routeConfigService: RoutesConfigService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.initProductList();

    this.registerListeners();
    this.initSideNavConfigs({
      headerBgColor: this.branchConfig.headerBgColor,
    });
  }

  /**
   * Initiating Product Selection
   */
  initProductList() {
    this.productList = new Product().deserialize(
      this.subscriptionPlanService.getSubscription()['products']
    ).productItems;

    // First load route setup
    this.initRouteConfig(this.router.url);
    // Route Subscription
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // This block will be executed when navigation to a new route has completed.
        // You can trigger your function or perform any necessary actions here.
        if (event?.urlAfterRedirects) {
          this.initRouteConfig(event.urlAfterRedirects);
        }
      }
    });
  }

  get currentRoute() {
    return this.routeConfigService.activeRouteConfig;
  }

  /**
   * Setting route configuration
   */
  initRouteConfig(finalRoute: string) {
    const routesArrayWithoutQuery = finalRoute.split('?');
    const routesArr = routesArrayWithoutQuery[0].split('/');

    const activeRouteConfig: ActiveRouteConfig = {
      product: {
        shortPath: routesArr[1] ?? '',
        fullPath: `/${routesArr[1]}`,
      },
      module: {
        shortPath: routesArr[2] ?? '',
        fullPath: `/${routesArr[1]}/${routesArr[2]}`,
      },
      submodule: {
        shortPath: routesArr[3] ?? '',
        fullPath: `/${routesArr[1]}/${routesArr[2]}/${routesArr[3]}`,
      },
    };

    const currentProduct = this.productList.find(
      (item) => item.path === activeRouteConfig.product.fullPath
    );

    if (currentProduct) {
      /**
       * Updating menu item based on route
       */
      this.menuItems = currentProduct.children ?? [];

      /**
       * Updating selected product
       */
      this.subscriptionPlanService.setSelectedProduct(currentProduct.name);

      const currentModule = this.menuItems?.find(
        (item) => item.path === activeRouteConfig.module.fullPath
      );
      const currentSubModule = currentModule?.children?.find(
        (item) => item.path === activeRouteConfig.submodule.fullPath
      );

      /**
       * Init Route Config (name, label, routes)
       */
      this.routeConfigService.initActiveRoute({
        product: {
          ...activeRouteConfig.product,
          name: currentProduct?.name,
          label: currentProduct?.title,
        },
        module: {
          ...activeRouteConfig.module,
          name: currentModule?.name,
          label: currentModule?.title,
        },
        submodule: {
          ...activeRouteConfig.submodule,
          name: currentSubModule?.name,
          label: currentSubModule?.title,
        },
      });
    } else {
      console.error('Error getting product', {
        fullPath: this.currentRoute.product.fullPath,
        routesArr,
        productList: this.productList,
      });
    }

    // Closing product menu on route change
    this.isMenuBarVisible = false;
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
      this.globalFilterService.selectedModule.subscribe((name: ModuleNames) => {
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

    this.productList = new Product().deserialize(
      this.subscriptionPlanService.getSubscription()['products']
    ).productItems;

    const selectedModule = this.selectedProduct
      ? this.productList.find((item) => item.name === this.selectedProduct)
      : this.productList.find((item) => item.isSubscribed);

    if (selectedModule) {
      this.selectedProduct = selectedModule.name;
      this.subscriptionPlanService.selectedProduct = this.selectedProduct;
      // this.menuItems = selectedModule.children;
    }

    this.setSelectedModuleBasedOnRoute();
  }

  toggleMenuButton(menuItem?: SubMenuItem) {
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

  // onMenuCLick(data: any) {
  //   this.selectedProduct = data.name;

  //   this.subscriptionPlanService.selectedProduct = this.selectedProduct;

  //   if (data.isSubscribed) {
  //     this.menuItems = data.children;
  //     this.setSelectedModuleBasedOnRoute();
  //     //route to first child of first product
  //     const childRoute = data.children.find(
  //       (item) => item.isView && item.isSubscribed
  //     );
  //     // ?.children?.find((item) => item.isView && item.isSubscribed);

  //     const childPath = routes[childRoute.name];

  //     const pathUrl = `pages/${routes[childRoute.name].replace(
  //       '{{product}}',
  //       routes[this.selectedProduct]
  //     )}`;

  //     this.router.navigate([pathUrl], {
  //       replaceUrl: true,
  //     });
  //   } else {
  //     this.menuItems = [];
  //     this.router.navigate([`pages/redirect`]);
  //   }

  //   this.subscriptionPlanService.setSettings();
  //   this.isMenuBarVisible = false;
  // }

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
  onImageLoad() {
    this.isImageLoaded = true;
  }
}
