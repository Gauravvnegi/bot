import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
@Component({
  selector: 'hospitality-bot-rates-bulk-update',
  templateUrl: './rates-bulk-update.component.html',
  styleUrls: ['./rates-bulk-update.component.scss'],
})
export class RatesBulkUpdateComponent implements OnInit {
  roomsData = RoomsData;
  useForm: FormGroup;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [
    {
      label: 'Update Rates',
      link: '/pages/channel-manager/update-rates/',
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

  onSubmit() {
    console.log(this.useForm.getRawValue());
  }
}
