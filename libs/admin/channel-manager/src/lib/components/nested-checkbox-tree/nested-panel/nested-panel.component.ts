import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RoomTypes, UpdatedEmitType } from '../../../types/bulk-update.types';

@Component({
  selector: 'hospitality-bot-nested-panel',
  templateUrl: './nested-panel.component.html',
  styleUrls: [
    './nested-panel.component.scss',
    '../../../../../../../admin/shared/src/lib/components/form-component/custom-checkbox.scss',
  ],
})
export class NestedPanelComponent {
  @Input() roomsData: RoomTypes;
  @Output() objectUpdated: EventEmitter<UpdatedEmitType> = new EventEmitter();
  parentHeadingStyle = {
    'font-size': '14px',
    'font-weight': 'bold',
  };
  constructor() {}

  onRoomChange(
    status: boolean,
    id: string,
    source: 'parent' | 'variant' | 'channel',
    variantIndex?: number,
    channelIndex?: number
  ) {
    this.objectUpdated.emit({
      status: status,
      id: id,
      source: source,
      variantIndex: variantIndex,
      channelIndex: channelIndex,
    } as UpdatedEmitType);
  }
}
