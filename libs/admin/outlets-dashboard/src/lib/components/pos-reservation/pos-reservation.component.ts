import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import {
  AdminUtilityService,
  Filter,
  Option,
} from '@hospitality-bot/admin/shared';
import { MenuList } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { Menu } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { Subscription } from 'rxjs';
import {
  menuCardData,
  reservationTabFilters,
} from '../../constants/data-table';
import { MealPreferences, mealPreferenceConfig } from '../../types/menu-order';
import { mealPreferences } from '../../constants/form';
import { MenuForm } from '../../types/form';
import { OutletFormService } from '../../services/outlet-form.service';
import { TableManagementService } from 'libs/table-management/src/lib/services/table-management.service';
import { AreaList } from 'libs/table-management/src/lib/models/data-table.model';
import { AreaListResponse } from 'libs/table-management/src/lib/types/table-datable.type';

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
  guestList: Option[] = [];

  cardData = menuCardData;
  tabFilters: Filter<string, string>[] = reservationTabFilters;
  $subscription = new Subscription();

  sendFeedback: boolean = false;
  emailInvoice: boolean = false;

  searchApi: string;
  selectedPreference: MealPreferences = MealPreferences.ALL;

  areaList: ({ label: string } & { list: Option[] })[] = [];

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private formService: OutletFormService,
    private tableManagementService: TableManagementService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
  }

  initForm() {
    this.userForm = this.fb.group({
      orderInformation: this.fb.group({
        search: [''],
        tableNumber: [[]],
        staff: [''],
        guest: [''],
        numberOfPersons: [''],
        menu: [[]],
      }),
      paymentInformation: this.fb.group({
        complementery: [false],
        paymentMethod: [''],
        paymentRecieved: [null],
        transactionId: [''],
      }),
    });
  }

  initDetails() {
    this.entityId = this.formService.entityId;
    this.getMenus();
    this.getTableData();
  }

  getMenus() {
    this.$subscription.add(
      this.outletService.getMenuList(this.entityId).subscribe((res) => {
        if (res) {
          this.menuOptions = new MenuList().deserialize(res).records;
          this.orderInfoControls.menu.patchValue(
            this.menuOptions.map((item) => item.value),
            { emitEvent: false }
          );
        }
      })
    );
  }

  getAreaConfig() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: 'AREA',
          offset: 0,
          limit: 200,
          sort: 'updated',
          raw: 'true',
        },
      ]),
    };
    return config;
  }

  getTableData() {
    this.$subscription.add;
    this.tableManagementService
      .getList('bb531a26-a258-472a-b918-1bc3e8c25285', this.getAreaConfig())
      .subscribe((res) => {
        const records = new AreaList().deserialize(res as AreaListResponse)
          .records;
        this.areaList = records.map((item) => ({
          label: item.name,
          list: item.tableList,
        }));
      });
  }

  getCards() {
    return this.cardData?.filter((item) =>
      mealPreferenceConfig[this.selectedPreference].filterPreference(
        item?.mealPreference
      )
    );
  }

  onSendFeedback(event: HTMLInputElement) {}

  onEmailInvoice(event: HTMLInputElement) {}

  clearSearch() {}

  getSearchValue(event: { status: boolean; response? }) {}

  postToRoom() {}

  handleSave(print: boolean = false) {}

  handleKOT(print: boolean = false) {}

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
