import {
  Compiler,
  Component,
  ComponentFactoryResolver,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  AdminUtilityService,
  ConfigService,
  Filter,
  Option,
  QueryConfig,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import {
  MenuItem,
  MenuItemList,
  MenuList,
} from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import {
  Menu,
  MenuItemResponse,
} from 'libs/admin/all-outlets/src/lib/types/outlet';
import { Subscription } from 'rxjs';
import {
  MealPreferences,
  OrderTypes,
  mealPreferenceConfig,
} from '../../types/menu-order';
import { MenuForm } from '../../types/form';
import { OutletFormService } from '../../services/outlet-form.service';
import { TableManagementService } from 'libs/table-management/src/lib/services/table-management.service';
import { AreaList } from 'libs/table-management/src/lib/models/data-table.model';
import { AreaListResponse } from 'libs/table-management/src/lib/types/table-datable.type';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { OutletTableService } from '../../services/outlet-table.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { reservationTabFilters } from '../../constants/data-table';
import { PosReservationResponse } from '../../types/reservation-table';
import { SideBarService } from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';

@Component({
  selector: 'hospitality-bot-pos-reservation',
  templateUrl: './pos-reservation.component.html',
  styleUrls: ['./pos-reservation.component.scss'],
})
export class PosReservationComponent implements OnInit {
  isSidebar: boolean;
  entityId: string;
  orderId: string;
  data: PosConfig;
  userForm: FormGroup;
  checkboxForm: FormGroup;
  @Output() onCloseSidebar = new EventEmitter();

  mealPreferences: MealPreferences[] = [];
  readonly mealPreferenceConfig = mealPreferenceConfig;

  defaultReservationData: PosReservationResponse;

  menuOptions: Menu[] = [];
  staffList: Option[] = [];
  orderTypes: Option[] = [];
  selectedGuest: Option;
  globalQueries = [];

  cardData: MenuItem[] = [];
  tabFilters: Filter<string, string>[] = reservationTabFilters;
  $subscription = new Subscription();

  loadingMenuItems: boolean = false;
  isPopular = true;
  initialMenuItemsLoad = false;

  searchApi: string = '/api/v1/search/menu-items';
  selectedPreference: MealPreferences = MealPreferences.ALL;

  areaList: Option[] = [];
  selectedCategories: string[] = [];
  selectedTable: Option;

  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private formService: OutletFormService,
    private tableManagementService: TableManagementService,
    private adminUtilityService: AdminUtilityService,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private outletTableService: OutletTableService,
    private snackbarService: SnackBarService,
    private compiler: Compiler,
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initForm();
    this.initDetails();
    if (this.orderId) {
      this.initOrderData();
    } else {
      this.getTableData();
    }
  }

  initForm() {
    this.userForm = this.fb.group({
      orderInformation: this.fb.group({
        orderType: [],
        search: [''],
        tableNumber: [''],
        staff: [''],
        guest: [''],
        numberOfPersons: [null],
        menu: [[]],
        address: [''],
        id: [null],
        areaId: [''],
      }),
      paymentInformation: this.fb.group({
        paymentMethod: [''],
        paymentRecieved: [null],
        transactionId: [''],
      }),
    });

    this.checkboxForm = this.fb.group({
      sendFeedback: [false],
      complementary: [false],
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        // set-global query everytime global filter changes
        this.globalQueries = [...data['dateRange'].queryValue];
      })
    );
  }

  initDetails() {
    this.entityId = this.formService.entityId;
    this.getMenus();
    this.getOrderConfig();
    this.initMealPreferences();
    this.listenForOrderTypeChanges();
    this.listenForTableChanges();
  }

  initMealPreferences() {
    // const menu = this.outletService.menu.value;
    this.$subscription.add(
      this.outletService.getOutletConfig().subscribe((res) => {
        const config = res.type.filter((item) => {
          if (item.menu) return item.menu;
        });
        this.mealPreferences = [
          { value: 'ALL' },
          ...config[0].menu.mealPreference,
        ].map((preference) => preference.value as MealPreferences);
      })
    );
  }

  initOrderData() {
    this.$subscription.add(
      this.outletTableService
        .getOrderById(this.entityId, this.orderId)
        .subscribe((res) => {
          if (res) {
            const formData = this.formService.mapOrderData(res);
            const menuItems = res.items
              .filter((item) => item.menuItem)
              .map((item) => new MenuItem().deserialize(item.menuItem));
            this.defaultReservationData = res.reservation;
            this.selectedTable = {
              label: res?.reservation?.tableNumberOrRoomNumber,
              value: res?.reservation?.tableIdOrRoomId,
            };
            this.userForm.patchValue(formData, { emitEvent: false });
            this.getTableData();
          }
        })
    );
  }

  getMenus() {
    this.listenForMenuChanges();
    this.loadingMenuItems = true;
    this.$subscription.add(
      this.outletService.getMenuList(this.entityId).subscribe((res) => {
        if (res) {
          this.menuOptions = new MenuList().deserialize(res).records;
          this.orderInfoControls.menu.patchValue(
            this.menuOptions.map((item) => item.value),
            { emitEvent: false }
          );
          this.getCategories();
          this.getMenuItems();

          if (!this.menuOptions.length) this.loadingMenuItems = false;
        }
      })
    );
  }

  getMenuItems() {
    this.$subscription.add(
      this.outletTableService
        .getFilteredMenuItems(this.getQueryConfig())
        .subscribe(
          (res) => {
            const menuItems = new MenuItemList().deserialize(res).records;
            if (menuItems.length) this.cardData = menuItems;
            this.initialMenuItemsLoad = true;
          },
          (error) => (this.loadingMenuItems = false),
          () => (this.loadingMenuItems = false)
        )
    );
  }

  getQueryConfig(): QueryConfig {
    const menuIds = this.orderInfoControls.menu.value.join(',');
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          entityState: 'ACTIVE',
          menuIds: menuIds,
          popular: this.isPopular,
          mealPreferences: this.selectedPreference,
          categories: this.selectedCategories.length
            ? this.selectedCategories
            : null,
        },
      ]),
    };
    return config;
  }

  getAreaConfig() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          type: 'AREA',
          offset: 0,
          limit: 0,
          raw: true,
          createBooking: true,
          roomTypeStatus: true,
        },
      ]),
    };
    return config;
  }

  listenForMenuChanges() {
    this.orderInfoControls.menu.valueChanges.subscribe((res) => {
      if (res?.length) {
        this.getCategories();
        this.getMenuItems();
      } else if (res.length === 0) {
        this.tabFilters = [];
        this.selectedCategories = [];
        this.cardData = [];
        this.formService.resetData();
      }
    });
  }

  listenForOrderTypeChanges() {
    const addressControl = this.orderInfoControls.address;
    const tableControl = this.orderInfoControls.tableNumber;
    const numberOfPersons = this.orderInfoControls.numberOfPersons;
    const guestControl = this.orderInfoControls.guest;

    this.updateValidators(guestControl, [Validators.required]);
    this.orderInfoControls.orderType.valueChanges.subscribe(
      (res: OrderTypes) => {
        if (res) {
          switch (res) {
            case OrderTypes.DELIVERY:
              this.updateValidators(guestControl);
              this.updateValidators(addressControl, [Validators.required]);
              this.resetValidators(numberOfPersons);
              this.resetValidators(tableControl);
              break;

            case OrderTypes.DINE_IN:
              this.updateValidators(guestControl);
              this.updateValidators(numberOfPersons, [
                Validators.required,
                Validators.min(1),
              ]);
              this.updateValidators(tableControl, [Validators.required]);
              this.resetValidators(addressControl);
              break;

            case OrderTypes.KIOSK:
            case OrderTypes.TAKE_AWAY:
              this.updateValidators(guestControl);
              this.resetValidators(addressControl);
              this.resetValidators(tableControl);
              this.resetValidators(numberOfPersons);
              break;
          }
        }
      }
    );
  }

  listenForTableChanges() {
    this.orderInfoControls.tableNumber.valueChanges.subscribe((res) => {
      if (res) {
        const selectedArea = this.areaList.filter(
          (area) => area.value === res
        )[0].areaId;
        this.orderInfoControls.areaId.patchValue(selectedArea, {
          emitEvent: false,
        });
      }
    });
  }

  getCategories() {
    const menuIds = this.orderInfoControls.menu.value.join(',');
    this.$subscription.add(
      this.outletTableService.getAllCategories(menuIds).subscribe((res) => {
        if (res) {
          this.tabFilters = [{ name: 'Popular', id: 'POPULAR' }, ...res]?.map(
            (item: { name: string; id: string }) => ({
              label: item.name,
              value: item.id,
              isSelected: item?.id === 'POPULAR',
            })
          );
        }
      })
    );
  }

  getGuestConfig() {
    const queries = {
      entityId: this.entityId,
      toDate: this.globalQueries[0].toDate,
      fromDate: this.globalQueries[1].fromDate,
      entityState: 'ALL',
      type: 'GUEST',
    };
    return queries;
  }

  getTableData() {
    this.$subscription.add(
      this.tableManagementService
        .getList(this.entityId, this.getAreaConfig())
        .subscribe((res) => {
          const records = new AreaList().deserialize(res as AreaListResponse)
            .records;
          this.areaList = records.reduce((acc, item) => {
            const tableOptions = item.tableList.map((table) => ({
              label: table.label,
              value: table.value,
              areaId: item.id,
            }));
            return acc.concat(tableOptions);
          }, []);

          this.orderId && this.areaList.unshift(this.selectedTable);
        })
    );
  }

  getCards() {
    return this.cardData?.filter((item) =>
      mealPreferenceConfig[this.selectedPreference].filterPreference(
        item?.mealPreference
      )
    );
  }

  getOrderConfig() {
    this.configService.getColorAndIconConfig(this.entityId).subscribe((res) => {
      if (res) {
        this.orderTypes = res.orderConfig.type.map(
          (item: { key: string; value: OrderTypes }) => ({
            label: item.key,
            value: item.value,
          })
        );
        this.orderInfoControls.orderType.patchValue(OrderTypes.DINE_IN);
      }
    });
  }

  guestChange(guest: GuestType) {
    if (guest) {
      this.mapGuestData(guest);
    }
  }

  mapGuestData(guest: GuestType) {
    this.selectedGuest = {
      label: `${guest.firstName} ${guest.lastName}`,
      value: guest.id,
    };
    const guestAddress = {
      formattedAddress: `${guest.address?.addressLine1 ?? ''}`,
      city: guest.address?.city ?? '',
      state: guest.address?.state ?? '',
      countryCode: guest.address?.countryCode ?? '',
      postalCode: guest.address?.postalCode ?? '',
      id: guest.address?.id,
    };
    this.orderInfoControls.address.patchValue(guestAddress);
  }

  showGuests() {
    const lazyModulePromise = import(
      'libs/admin/guests/src/lib/admin-guests.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminGuestsModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });
    lazyModulePromise.then((moduleFactory) => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(AddGuestComponent);
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSidebar = true;
      manageMaskZIndex();
      componentRef.instance.onCloseSidebar.subscribe((res) => {
        this.sidebarVisible = false;
        if (typeof res !== 'boolean') {
          this.mapGuestData(res);
        }
        componentRef.destroy();
      });
    });
  }

  selectedTab(selectedCategory: string) {
    if (selectedCategory) {
      this.isPopular = selectedCategory === 'POPULAR' ? true : null;
      this.selectedCategories =
        selectedCategory === 'POPULAR' ? [] : [selectedCategory];
      this.initialMenuItemsLoad && this.getMenuItems();
    }
  }

  checkOrderType(isAddress: boolean = false) {
    const selectedOrderType = this.orderInfoControls.orderType.value;
    return selectedOrderType === OrderTypes.DINE_IN;
  }

  clearSearch() {
    this.orderInfoControls.search.patchValue('', { emitEvent: false });
    this.getMenuItems();
  }

  getSearchValue(event: { status: boolean; response: MenuItemResponse[] }) {
    if (event?.response) {
      const cards =
        event.response?.map((item: MenuItemResponse) =>
          new MenuItem().deserialize(item)
        ) ?? [];
      this.cardData = cards;
    } else {
      this.getMenuItems();
    }
  }

  postToRoom() {}

  handleSave() {
    this.orderId ? this.updateOrder() : this.createOrder();
  }

  createOrder() {
    const data = this.formService.getOutletFormData(
      this.userForm.getRawValue() as MenuForm
    );
    this.$subscription.add(
      this.outletTableService.createOrder(this.entityId, data).subscribe(
        (res) => {},
        (error) => {},
        () => {
          this.close();
          this.snackbarService.openSnackBarAsText(
            'Order created successfully',
            '',
            {
              panelClass: 'success',
            }
          );
        }
      )
    );
  }

  updateOrder() {
    const data = this.formService.getOutletUpdateData(
      this.userForm.getRawValue() as MenuForm,
      this.defaultReservationData
    );
    this.$subscription.add(
      this.outletTableService
        .updateOrder(this.entityId, this.orderId, data)
        .subscribe(
          (res) => {},
          (error) => {},
          () => {
            this.close();
            this.snackbarService.openSnackBarAsText(
              'Order updated successfully',
              '',
              {
                panelClass: 'success',
              }
            );
          }
        )
    );
  }

  handleKOT(print: boolean = false) {}

  close() {
    this.selectedCategories = [];
    this.formService.resetData();
    this.onCloseSidebar.emit();
  }

  resetValidators(control: AbstractControl) {
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity({ emitEvent: false });
    control.markAsUntouched();
  }

  updateValidators(control: AbstractControl, validators?: ValidatorFn[]) {
    validators && control.setValidators(validators);
    control.updateValueAndValidity({ emitEvent: false });
    control.markAsUntouched();
  }

  trackCards(index: number, item: MenuItem) {
    return item.id;
  }

  get orderInfoControls() {
    return (this.userForm.get('orderInformation') as FormGroup)
      .controls as Record<keyof MenuForm['orderInformation'], AbstractControl>;
  }

  ngOnDestroy() {
    this.formService.resetData();
    this.$subscription.unsubscribe();
  }
}

export type PosConfig = {
  area: string;
  tableName: string;
};
