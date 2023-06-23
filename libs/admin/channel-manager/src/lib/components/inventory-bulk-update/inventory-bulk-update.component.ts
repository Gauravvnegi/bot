import { Component, OnInit } from '@angular/core';
import { inventoryTreeList } from '../../constants/data';

@Component({
  selector: 'hospitality-bot-inventory-bulk-update',
  templateUrl: './inventory-bulk-update.component.html',
  styleUrls: ['./inventory-bulk-update.component.scss'],
})
export class InventoryBulkUpdateComponent implements OnInit {
  inventoryTreeList = inventoryTreeList;
  constructor() {}

  ngOnInit(): void {}

  objectChange() {
    console.log('***Object Change', this.inventoryTreeList);
  }
}
