import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Filter, Option } from '@hospitality-bot/admin/shared';
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

@Component({
  selector: 'hospitality-bot-pos-reservation',
  templateUrl: './pos-reservation.component.html',
  styleUrls: ['./pos-reservation.component.scss'],
})
export class PosReservationComponent implements OnInit {
  isSidebar: boolean;
  data: PosConfig;
  userForm: FormGroup;
  @Output() onCloseSidebar = new EventEmitter();

  mealPreferences = ['ALL', ...mealPreferences];
  readonly mealPreferenceConfig = mealPreferenceConfig;

  menuOptions: Menu[] = [];
  tableNumbers: Option[] = [];
  staffList: Option[] = [];
  guestList: Option[] = [];

  cardData = menuCardData;
  tabFilters: Filter<string, string>[] = reservationTabFilters;
  $subscription = new Subscription();

  sendFeedback: boolean = false;
  emailInvoice: boolean = false;

  searchApi: string;
  selectedPreference: MealPreferences = MealPreferences.ALL;

  constructor(private fb: FormBuilder, private outletService: OutletService) {}

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
    this.getMenus();
  }

  getMenus() {
    this.$subscription.add(
      this.outletService.getMenuList(this.data.entityId).subscribe((res) => {
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
    this.onCloseSidebar.emit();
  }

  get orderInfoControls() {
    return (this.userForm.get('orderInformation') as FormGroup)
      .controls as Record<keyof MenuForm['orderInformation'], AbstractControl>;
  }
}

export type PosConfig = {
  area: string;
  tableName: string;
  invoiceId: string;
  entityId: string;
};
