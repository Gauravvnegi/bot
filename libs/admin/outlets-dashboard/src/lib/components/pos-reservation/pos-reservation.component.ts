import {
  Component,
  ComponentFactoryResolver,
  EventEmitter,
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
import { EMPTY, Subscription } from 'rxjs';
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
import {
  KotMenuItem,
  PosReservationResponse,
} from '../../types/reservation-table';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { debounceTime, switchMap } from 'rxjs/operators';
import { GuestAddress } from 'libs/admin/agent/src/lib/types/response';

@Component({
  selector: 'hospitality-bot-pos-reservation',
  templateUrl: './pos-reservation.component.html',
  styleUrls: ['./pos-reservation.component.scss'],
})
export class PosReservationComponent implements OnInit {
  isSidebar: boolean;
  entityId: string;

  orderId: string;
  reservationId: string;

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
  addressList: Option[] = [];

  selectedGuest: Option;
  globalQueries = [];

  cardData: MenuItem[] = [];
  tabFilters: Filter<string, string>[] = reservationTabFilters;
  $subscription = new Subscription();

  loadingMenuItems: boolean = false;
  isPopular = true;
  initialMenuItemsLoad = false;
  isDisabledForm = false;
  isDraftOrder = false;

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
    private resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initForm();
    this.initDetails();
    this.initFormData();
  }

  initFormData() {
    if (this.orderId) this.initOrderData();
    if (this.reservationId && !this.orderId) this.initReservationData();
    if (!this.reservationId && !this.orderId) this.getTableData();
    this.getOrderSummary();
  }

  initForm() {
    this.userForm = this.fb.group({
      reservationInformation: this.fb.group({
        orderType: [OrderTypes.DINE_IN],
        search: [''],
        tableNumber: ['', [Validators.required]],
        staff: [''],
        guest: ['', [Validators.required]],
        numberOfPersons: [null, [Validators.required, Validators.min(1)]],
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
      paymentSummary: this.fb.group({
        totalCharge: [0],
        totalContainerCharge: [0],
        totalDiscount: [0],
        totalPayable: [0],
        totalPaidAmount: [0],
        remainingBalance: [0],
        totalTaxes: [0],
      }),
      offer: [''],
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
            this.userForm.patchValue(formData, { emitEvent: false });
            if (res.status === 'CANCELED') {
              this.checkboxForm.disable();
              this.isDisabledForm = true;
            }
            this.updateOrderValidators(
              formData.reservationInformation.orderType
            );
            this.isDraftOrder = res.status === 'DRAFT';
            this.isDraftOrder && this.mapItemsForDraftOrder(res?.items);
            this.mapGuestData(res.guest, res.deliveryAddress);
            this.mapDefaultReservationData(res.reservation);
            this.formService.getOrderSummary.next(true);
          }
        })
    );
  }

  /**
   * Init reservation data only here in case no order is placed
   */
  initReservationData() {
    this.outletService
      .getReservationById(this.reservationId)
      .subscribe((res) => {
        if (res) {
          if (res.order) {
            const formData = this.formService.mapReservationData(res);
            this.userForm.patchValue(formData, { emitEvent: false });
            this.formService.getOrderSummary.next(true);
            this.isDraftOrder = res.order.status === 'DRAFT';
            this.isDraftOrder && this.mapItemsForDraftOrder(res?.order?.items);
          } else {
            const reservationInformation = {
              tableNumber: res?.tableIdOrRoomId,
              guest: res?.guest.id,
              numberOfPersons: res?.occupancyDetails.maxAdult,
              orderType: OrderTypes.DINE_IN,
              areaId: res.areaId,
              id: res?.id,
            };
            this.userForm.patchValue(
              { reservationInformation: reservationInformation },
              { emitEvent: false }
            );
            this.updateOrderValidators(reservationInformation.orderType);
          }
          this.mapGuestData(res.guest, res?.deliveryAddress);
          this.mapDefaultReservationData(res);
        }
      });
  }

  mapDefaultReservationData(data: PosReservationResponse) {
    this.selectedTable = {
      label: data?.tableNumberOrRoomNumber,
      value: data?.tableIdOrRoomId,
    };
    this.defaultReservationData = data;
    this.getTableData();
  }

  /**
   * Map items in selected items in form service for draft order
   */
  mapItemsForDraftOrder(kotMenuItems: KotMenuItem[]) {
    setTimeout(() => {
      let menuItems: MenuItem[] = [];
      kotMenuItems.forEach((item) => {
        if (item?.menuItem) {
          const addItem = new MenuItem().deserialize(item?.menuItem);
          menuItems.unshift(addItem);
        }
      });

      // Map all data at once.
      this.formService.addItemToSelectedItems(menuItems);
    }, 50);
  }

  getMenus() {
    this.listenForMenuChanges();
    this.loadingMenuItems = true;
    this.$subscription.add(
      this.outletService.getMenuList(this.entityId, true).subscribe((res) => {
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
    this.loadingMenuItems = true;
    this.$subscription.add(
      this.outletTableService
        .getFilteredMenuItems(this.getQueryConfig())
        .subscribe(
          (res) => {
            const menuItems = new MenuItemList().deserialize(res).records;
            this.cardData = menuItems;
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
        {
          fromDate: Date.now(),
          toDate: Date.now() + 2 * 60 * 60 * 1000,
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
    this.orderInfoControls.orderType.valueChanges.subscribe(
      (res: OrderTypes) => {
        if (res) this.updateOrderValidators(res);
      }
    );
  }

  updateOrderValidators(orderType: OrderTypes) {
    const addressControl = this.orderInfoControls.address;
    const tableControl = this.orderInfoControls.tableNumber;
    const numberOfPersons = this.orderInfoControls.numberOfPersons;
    const guestControl = this.orderInfoControls.guest;

    !this.orderId && this.formService.getOrderSummary.next(true);
    switch (orderType) {
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

  getOrderSummary() {
    this.$subscription.add(
      this.formService.getOrderSummary
        .pipe(
          debounceTime(200),
          switchMap((res) => {
            if (!res) {
              return EMPTY; // No need to proceed if res is falsy
            }

            const data = this.formService.postOrderSummaryData(
              this.userForm.getRawValue() as MenuForm,
              this.orderId
            );
            if (!data.outletOrder.items.length) return EMPTY;
            return this.outletTableService.getOrderSummary(data);
          })
        )
        .subscribe((res) => {
          if (res) {
            const paymentData = this.formService.mapPaymentSummary(res);
            this.inputControls.paymentSummary.patchValue(paymentData);
          }
        })
    );
  }

  listenForTableChanges() {
    this.orderInfoControls.tableNumber.valueChanges.subscribe((res) => {
      if (res) {
        const selectedArea = this.areaList.filter(
          (area) => area.value === res
        )[0]?.areaId;

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
      type: 'GUEST,NON_RESIDENT_GUEST',
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

          (this.orderId || this.reservationId) &&
            this.areaList.unshift(this.selectedTable);
          if (this.selectedTable) {
            this.orderInfoControls.tableNumber.patchValue(
              this.selectedTable.value
            );
          }
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
      }
    });
  }

  guestChange(guest: GuestType) {
    if (guest) {
      this.mapGuestData(guest);
    }
  }

  mapGuestData(guest: GuestType, reservationAddress?: GuestAddress) {
    this.selectedGuest = {
      label: guest?.label
        ? guest.label
        : `${guest?.firstName} ${guest?.lastName}`,
      value: guest.value ? guest.value : guest.id,
      address: reservationAddress ?? guest?.address,
    };
    this.mapGuestAddress();
  }

  mapGuestAddress(guestAddress?: GuestAddress) {
    const address = this.selectedGuest?.address ?? guestAddress;
    this.addressList = address?.addressLine1
      ? [{ label: address.addressLine1, value: address?.id }]
      : [];
    this.addressList.length &&
      this.orderInfoControls.address.patchValue(address?.id);
  }

  showGuests() {
    this.sidebarVisible = true;
    const factory = this.resolver.resolveComponentFactory(AddGuestComponent);
    this.sidebarSlide.clear();
    const componentRef = this.sidebarSlide.createComponent(factory);
    componentRef.instance.isSidebar = true;
    componentRef.instance.guestType = 'NON_RESIDENT_GUEST';
    this.$subscription.add(
      componentRef.instance.onCloseSidebar.subscribe(
        (res: GuestType | boolean) => {
          if (typeof res !== 'boolean') {
            this.mapGuestData(res);
          }
          this.sidebarVisible = false;
        }
      )
    );
    manageMaskZIndex();
  }

  selectedTab(selectedCategory: string) {
    if (selectedCategory) {
      this.isPopular = selectedCategory === 'POPULAR' ? true : null;
      this.selectedCategories =
        selectedCategory === 'POPULAR' ? [] : [selectedCategory];
      this.initialMenuItemsLoad && this.getMenuItems();
    }
  }

  selectedPreferenceChange(preference: MealPreferences) {
    this.selectedPreference = preference;
    this.getMenuItems();
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

  holdKot() {
    this.orderId ? this.updateOrder('DRAFT') : this.createOrder('DRAFT');
  }

  handleSaveKot() {
    this.orderId ? this.updateOrder() : this.createOrder();
  }

  createOrder(orderStatus: 'DRAFT' | 'CONFIRMED' = 'CONFIRMED') {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please check data and try again !'
      );
      return;
    }
    const data = this.formService.getOutletFormData(
      this.userForm.getRawValue() as MenuForm,
      this.defaultReservationData,
      orderStatus
    );
    this.$subscription.add(
      this.outletTableService.createOrder(this.entityId, data).subscribe(
        (res) => {},
        (error) => {},
        () => {
          this.close(true);
          // this.resetForm();
          this.snackbarService.openSnackBarAsText(
            orderStatus === 'DRAFT'
              ? 'Draft order created'
              : 'Order created successfully',
            '',
            {
              panelClass: 'success',
            }
          );
        }
      )
    );
  }

  updateOrder(orderStatus: 'DRAFT' | 'CONFIRMED' = 'CONFIRMED') {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please check data and try again !'
      );
      return;
    }
    const currOrderStatus = this.isDraftOrder ? orderStatus : 'CONFIRMED';

    const data = this.formService.getOutletUpdateData(
      this.userForm.getRawValue() as MenuForm,
      this.defaultReservationData,
      currOrderStatus
    );
    this.$subscription.add(
      this.outletTableService
        .updateOrder(this.entityId, this.orderId, data)
        .subscribe(
          (res) => {},
          (error) => {},
          () => {
            this.close(true);
            this.resetForm();
            this.snackbarService.openSnackBarAsText(
              orderStatus === 'DRAFT'
                ? 'Draft order updated'
                : 'Order updated successfully',
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

  resetForm() {
    this.initForm();
    this.selectedCategories = [];
    this.orderId = undefined;
    this.formService.resetData();
    this.isDisabledForm = false;
  }

  close(isSaved: boolean = false) {
    this.$subscription.unsubscribe();
    this.selectedCategories = [];
    this.formService.resetData();
    this.onCloseSidebar.emit(isSaved);
  }

  resetValidators(control: AbstractControl) {
    // control.reset();
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
    return (this.userForm.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof MenuForm['reservationInformation'],
      AbstractControl
    >;
  }

  get paymentSummaryControls() {
    return (this.userForm.get('paymentSummary') as FormGroup)
      .controls as Record<keyof MenuForm['paymentSummary'], AbstractControl>;
  }

  get inputControls() {
    return this.userForm.controls as Record<keyof MenuForm, AbstractControl>;
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
