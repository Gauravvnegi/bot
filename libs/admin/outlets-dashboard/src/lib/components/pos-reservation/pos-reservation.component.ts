import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { MenuList } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { OutletService } from 'libs/admin/all-outlets/src/lib/services/outlet.service';
import { Menu } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { Subscription } from 'rxjs';

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

  $subscription = new Subscription();

  searchApi: string;

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

  clearSearch() {}

  getSearchValue(event: { status: boolean; response? }) {}

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
