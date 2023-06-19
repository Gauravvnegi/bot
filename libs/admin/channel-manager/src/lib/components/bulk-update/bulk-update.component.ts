import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import {
  updateItems,
  roomTypes,
  weeks,
} from '../constants/bulkupdate-response';
@Component({
  selector: 'hospitality-bot-bulk-update',
  templateUrl: './bulk-update.component.html',
  styleUrls: ['./bulk-update.component.scss'],
})
export class BulkUpdateComponent implements OnInit {
  roomsData = RoomsData;
  useForm: FormGroup;
  updateItems = updateItems;
  roomTypes = roomTypes;
  weeks = weeks;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [
    {
      label: 'Update Inventory',
      link: '/pages/channel-manager/update-inventory',
    },
    { label: 'Bulk Update', link: './' },
  ];
  startMinDate = new Date();
  endMinDate = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.useForm = this.fb.group({
      update: ['AVAILABILITY'], // RATE, AVAILABILITY,
      updateValue: [''],
      fromDate: [''],
      toDate: [''],
      roomType: [''],
      selectedDays: [[]],
    });
  }

  onChangeNesting() {
    console.log('***Object List***', this.roomsData);
  }

  onSubmit() {}
}
