import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { UpdatedEmitType, Variant } from '../../types/bulk-update.types';

@Component({
  selector: 'hospitality-bot-inventory-nested-checkbox-tree',
  templateUrl: './inventory-nested-checkbox-tree.component.html',
  styleUrls: [
    './inventory-nested-checkbox-tree.component.scss',
    '../nested-checkbox-tree/nested-checkbox-tree.component.scss',
  ],
})
export class InventoryNestedCheckboxTreeComponent implements OnInit {
  @Input() variants: Variant[];
  @Output() objectChange = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    this.checkBoxVerify();
  }

  onChannelChange(status: boolean, variantIndex: number, channelIndex: number) {
    const selectedObject = this.variants[variantIndex];
    selectedObject.channels[channelIndex].isSelected = status;
    selectedObject.isSelected = selectedObject.channels.every(
      (item) => item.isSelected
    );
    this.objectChange.emit();
  }

  onVariantChange(status: boolean, variantIndex) {
    const selectedObject = this.variants[variantIndex];
    selectedObject.isSelected = status;
    selectedObject.channels.map((item) => (item.isSelected = status));
    this.objectChange.emit();
  }

  checkBoxVerify() {
    for (let item in this.variants) {
      item['isSelected'] = item['channels'].every((item) => item['isSelected']);
    }
  }
}
