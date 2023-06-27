import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoomTypes, UpdatedEmitType } from '../../../types/bulk-update.types';

@Component({
  selector: 'hospitality-bot-nested-panel',
  templateUrl: './nested-panel.component.html',
  styleUrls: [
    './nested-panel.component.scss',
    '../../../../../../../admin/shared/src/lib/components/form-component/custom-checkbox.scss',
  ],
})
export class NestedPanelComponent implements OnInit {
  @Input() roomsData: RoomTypes;
  @Output() objectUpdated: EventEmitter<UpdatedEmitType> = new EventEmitter();
  parentHeadingStyle = {
    'font-size': '14px',
    'font-weight': 'bold',
  };
  constructor() {}

  ngOnInit(): void {
    console.log(this.roomsData);
  }

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
