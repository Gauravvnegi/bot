import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RoomTypes, UpdatedEmitType } from '../../types/bulk-update.types';
@Component({
  selector: 'hospitality-bot-rates-nested-checkbox-tree',
  templateUrl: './rates-nested-checkbox-tree.component.html',
  styleUrls: ['./rates-nested-checkbox-tree.component.scss'],
})
export class RatesNestedCheckboxTreeComponent {
  @Input() roomsData: RoomTypes[];
  @Output() objectChanged: EventEmitter<{
    change: UpdatedEmitType;
    object: RoomTypes;
  }> = new EventEmitter();
  constructor() {}

  onRoomChange(event: UpdatedEmitType, objectIndex: number) {
    this.objectChanged.emit({
      change: event,
      object: this.roomsData[objectIndex],
    });
  }
}
