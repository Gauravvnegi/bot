import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { BulkUpdateRequest, RoomTypes } from '../../types/bulk-update.types';
import {
  CheckBoxTreeFactory,
  FormFactory,
} from '../../models/bulk-update.models';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
@Component({
  selector: 'hospitality-bot-rates-bulk-update',
  templateUrl: './rates-bulk-update.component.html',
  styleUrls: ['./rates-bulk-update.component.scss'],
})
export class RatesBulkUpdateComponent implements OnInit {
  hotelId: string;
  roomsData: any;
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
  isFormValid = false;

  roomTypes = [];

  constructor(
    private fb: FormBuilder,
    private globalFilter: GlobalFilterService,
    private formService: ChannelManagerFormService
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilter.hotelId;
    const today = new Date();
    const seventhDate = new Date();
    seventhDate.setDate(today.getDate() + 7);

    this.useForm = this.fb.group({
      update: ['availability'], // RATE, AVAILABILITY,
      updateValue: ['', [Validators.required]],
      fromDate: [today.getTime(), [Validators.required]],
      toDate: [seventhDate.getTime(), [Validators.required]],
      roomType: [[]],
      selectedDays: [[], [Validators.required]],
    });
    this.listenChanges();
    this.loadRooms();
  }

  loadRooms() {
    this.formService.roomDetails.subscribe((rooms) => {
      this.roomTypes = rooms;
      !this.roomTypes.length && this.formService.loadRoomTypes(this.hotelId);
      this.loadTree({ roomType: '' });
    });
  }

  listenChanges() {
    this.useForm.valueChanges.subscribe((value) => {
      this.isFormValid = this.useForm.valid;
      this.roomTypes;
      this.loadTree(value);
    });
  }

  loadTree(controls) {
    this.roomsData = CheckBoxTreeFactory.buildTree(
      this.roomTypes,
      controls.roomType,
      { isInventory: false }
    );
  }

  onChangeNesting() {
    console.log('***Object List***', this.roomsData);
  }

  onSubmit() {
    console.log('*** Form data', this.useForm.getRawValue());

    const data: BulkUpdateRequest[] = FormFactory.makeRatesRequestData(
      this.useForm.getRawValue()
    );

    console.log('*** Ready For Request data', data);
  }
}
