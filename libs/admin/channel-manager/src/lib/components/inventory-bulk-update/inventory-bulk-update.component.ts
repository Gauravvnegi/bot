import { Component, OnInit } from '@angular/core';
import { inventoryTreeList } from '../../constants/data';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-inventory-bulk-update',
  templateUrl: './inventory-bulk-update.component.html',
  styleUrls: ['./inventory-bulk-update.component.scss'],
})
export class InventoryBulkUpdateComponent implements OnInit {
  inventoryTreeList = inventoryTreeList;
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

  constructor(private fb: FormBuilder, private route: Router) {}

  ngOnInit(): void {
    this.useForm = this.fb.group({
      update: ['AVAILABILITY'], // RATE, AVAILABILITY,
      updateValue: ['', [Validators.required]],
      fromDate: [new Date(), [Validators.required]],
      toDate: [
        new Date().setDate(new Date().getDate() + 7),
        [Validators.required],
      ],
      roomType: [''],
      selectedDays: [[]],
    });
    this.listenChanges();
  }

  listenChanges() {
    this.useForm.valueChanges.subscribe((value) => {
      this.isFormValid = this.useForm.valid;
    });
  }

  objectChange() {
    console.log('***Object Change', this.inventoryTreeList);
  }

  onSubmit() {
    console.log(this.useForm.getRawValue());
  }
}
