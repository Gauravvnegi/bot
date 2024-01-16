import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filter, Option } from '@hospitality-bot/admin/shared';
import { MenuList } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { Menu } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { Subscription } from 'rxjs';
import {
  menuCardData,
  reservationTabFilters,
} from '../../constants/data-table';
import { MenuItemCard } from '../../types/menu-order';

@Component({
  selector: 'hospitality-bot-pos-reservation',
  templateUrl: './pos-reservation.component.html',
  styleUrls: ['./pos-reservation.component.scss'],
})
export class PosReservationComponent implements OnInit {
  isSidebar: boolean;
  data: PosConfig;
  menuForm: FormGroup;
  userForm: FormGroup;
  @Output() onCloseSidebar = new EventEmitter();

  menuOptions: Menu[] = [];
  tableNumbers: Option[] = [];
  staffList: Option[] = [];
  guestList: Option[] = [];

  cardData: MenuItemCard[] = menuCardData;
  tabFilters: Filter<string, string>[] = reservationTabFilters;
  $subscription = new Subscription();

  sendFeedback: boolean = false;
  emailInvoice: boolean = false;

  searchApi: string;
  selectedCategory: string = 'All';

  constructor(private fb: FormBuilder, private outletService: OutletService) {}

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
  }

  initForm() {
    this.menuForm = this.fb.group({
      menu: [[]],
    });

    this.userForm = this.fb.group({
      search: [''],
      tableNumber: [[]],
      staff: [''],
      guest: [''],
      numberOfPersons: [''],
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
        }
      })
    );
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  getCards() {
    const cards = this.cardData?.filter((item) => {
      if (this.selectedCategory === 'All') return item;
      if (this.selectedCategory === 'Veg') return item.category === 'VEG';
      if (this.selectedCategory === 'Non-veg')
        return item.category === 'NON_VEG';
    });
    return cards;
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
}

export type PosConfig = {
  area: string;
  tableName: string;
  invoiceId: string;
  entityId: string;
};
