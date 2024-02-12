import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import {
  AdminUtilityService,
  ConfigService,
  Filter,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import {
  MenuItem,
  MenuItemList,
  MenuList,
} from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { Menu } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { Subscription } from 'rxjs';
import { reservationTabFilters } from '../../constants/data-table';
import {
  MealPreferences,
  OrderTypes,
  mealPreferenceConfig,
} from '../../types/menu-order';
import { mealPreferences } from '../../constants/form';
import { MenuForm } from '../../types/form';
import { OutletFormService } from '../../services/outlet-form.service';
import { TableManagementService } from 'libs/table-management/src/lib/services/table-management.service';
import { AreaList } from 'libs/table-management/src/lib/models/data-table.model';
import { AreaListResponse } from 'libs/table-management/src/lib/types/table-datable.type';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { OutletTableService } from '../../services/outlet-table.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';

@Component({
  selector: 'hospitality-bot-pos-reservation',
  templateUrl: './pos-reservation.component.html',
  styleUrls: ['./pos-reservation.component.scss'],
})
export class PosReservationComponent implements OnInit {
  isSidebar: boolean;
  entityId: string;
  data: PosConfig;
  userForm: FormGroup;
  @Output() onCloseSidebar = new EventEmitter();

  mealPreferences = ['ALL', ...mealPreferences];
  readonly mealPreferenceConfig = mealPreferenceConfig;

  menuOptions: Menu[] = [];
  staffList: Option[] = [];
  orderTypes: Option[] = [];
  selectedGuest: Option;
  globalQueries = [];

  cardData: MenuItem[] = [];
  tabFilters: Filter<string, string>[] = reservationTabFilters;
  $subscription = new Subscription();

  sendFeedback: boolean = false;
  emailInvoice: boolean = false;
  printInvoice: boolean = false;

  loadingMenuItems: boolean = false;

  searchApi: string;
  selectedPreference: MealPreferences = MealPreferences.ALL;

  areaList: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private formService: OutletFormService,
    private tableManagementService: TableManagementService,
    private adminUtilityService: AdminUtilityService,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private outletTableService: OutletTableService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initForm();
    this.initDetails();
  }

  initForm() {
    this.userForm = this.fb.group({
      orderInformation: this.fb.group({
        orderType: [],
        search: [''],
        tableNumber: [[]],
        staff: [''],
        guest: [''],
        numberOfPersons: [null],
        menu: [[]],
        address: [''],
      }),
      paymentInformation: this.fb.group({
        complementery: [false],
        paymentMethod: [''],
        paymentRecieved: [null],
        transactionId: [''],
      }),
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [...data['dateRange'].queryValue];
    });
  }

  initDetails() {
    this.entityId = this.formService.entityId;
    this.getMenus();
    this.getOrderConfig();
    this.getTableData();
  }

  getMenus() {
    this.loadingMenuItems = true;
    this.$subscription.add(
      this.outletService.getMenuList(this.entityId).subscribe((res) => {
        if (res) {
          this.menuOptions = new MenuList().deserialize(res).records;
          this.orderInfoControls.menu.patchValue(
            this.menuOptions.map((item) => item.value),
            { emitEvent: false }
          );
          this.menuOptions.forEach((item) => {
            this.getMenuItems(item.id);
          });
          if (!this.menuOptions.length) this.loadingMenuItems = false;
        }
      })
    );
  }

  getMenuItems(menuId: string) {
    this.$subscription.add(
      this.outletService
        .getMenuItems(this.getQueryConfig(menuId), this.entityId)
        .subscribe(
          (res) => {
            const menuItems = new MenuItemList().deserialize(res).records;
            if (menuItems.length)
              this.cardData = [...this.cardData, ...menuItems];
          },
          (error) => (this.loadingMenuItems = false),
          () => (this.loadingMenuItems = false)
        )
    );
  }

  getQueryConfig(id: string): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          entityState: 'ACTIVE',
          menuId: id,
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
          raw: 'true',
          createBooking: true,
          roomTypeStatus: true,
        },
      ]),
    };
    return config;
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
    this.$subscription.add;
    this.tableManagementService
      .getList(this.entityId, this.getAreaConfig())
      .subscribe((res) => {
        const records = new AreaList().deserialize(res as AreaListResponse)
          .records;
        this.areaList = records.reduce((acc, item) => {
          const tableOptions = item.tableList.map((table) => ({
            label: table.label,
            value: table.value,
          }));
          return acc.concat(tableOptions);
        }, []);
      });
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
        this.orderInfoControls.orderType.patchValue(OrderTypes.DINE_IN, {
          emitEvent: false,
        });
      }
    });
  }

  guestChange(guest: GuestType) {
    if (guest) {
      this.selectedGuest = {
        label: `${guest.firstName} ${guest.lastName}`,
        value: guest.id,
      };
    }
  }

  checkOrderType(isAddress: boolean = false) {
    const selectedOrderType = this.orderInfoControls.orderType.value;
    return selectedOrderType === OrderTypes.DINE_IN;
  }

  onSendFeedback(event: HTMLInputElement) {}

  onEmailInvoice(event: HTMLInputElement) {}

  onPrintInvoice(event: HTMLInputElement) {}

  clearSearch() {}

  getSearchValue(event: { status: boolean; response? }) {}

  postToRoom() {}

  handleSave(print: boolean = false) {}

  handleKOT(print: boolean = false) {
    const data = this.formService.getOutletFormData(
      this.userForm.getRawValue() as MenuForm
    );
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
    );
  }

  close() {
    this.formService.resetData();
    this.onCloseSidebar.emit();
  }

  get orderInfoControls() {
    return (this.userForm.get('orderInformation') as FormGroup)
      .controls as Record<keyof MenuForm['orderInformation'], AbstractControl>;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

export type PosConfig = {
  area: string;
  tableName: string;
};
