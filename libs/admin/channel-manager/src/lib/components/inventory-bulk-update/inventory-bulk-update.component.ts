import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { CheckBoxTreeFactory } from '../../models/bulk-update.models';

@Component({
  selector: 'hospitality-bot-inventory-bulk-update',
  templateUrl: './inventory-bulk-update.component.html',
  styleUrls: ['./inventory-bulk-update.component.scss'],
})
export class InventoryBulkUpdateComponent implements OnInit {
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

  constructor(
    private fb: FormBuilder,
    private formService: ChannelManagerFormService
  ) {}

  ngOnInit(): void {
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
  }

  listenChanges() {
    this.useForm.valueChanges.subscribe((value) => {
      this.isFormValid = this.useForm.valid;
      this.inventoryTreeList = CheckBoxTreeFactory.buildTree(
        this.formService.getRoomsData,
        value.roomType,
        { isInventory: true }
      );
    });
  }

  objectChange() {
    console.log('***Object Change', this.inventoryTreeList);
  }

  onSubmit() {
    console.log(this.useForm.getRawValue());
  }
}
