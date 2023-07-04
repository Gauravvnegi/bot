import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { CheckBoxTreeFactory } from '../../models/bulk-update.models';
import { RoomTypes } from '../../types/channel-manager.types';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-inventory-bulk-update',
  templateUrl: './inventory-bulk-update.component.html',
  styleUrls: ['./inventory-bulk-update.component.scss'],
})
export class InventoryBulkUpdateComponent implements OnInit {
  hotelId: string;
  inventoryTreeList = [];
  useForm: FormGroup;
  isFormValid = false;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [
    {
      label: 'Update Inventory',
      link: '/pages/channel-manager/update-inventory/',
    },
    { label: 'Bulk Update', link: './' },
  ];
  roomTypes: RoomTypes[] = [];

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
      roomType: [''],
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
      this.loadTree(value);
    });
  }

  loadTree(controls) {
    this.inventoryTreeList = CheckBoxTreeFactory.buildTree(
      this.roomTypes,
      controls.roomType,
      { isInventory: true }
    );
  }

  objectChange() {
    console.log('***Object Change', this.inventoryTreeList);
  }

  onSubmit() {
    console.log(this.useForm.getRawValue());
  }
}
