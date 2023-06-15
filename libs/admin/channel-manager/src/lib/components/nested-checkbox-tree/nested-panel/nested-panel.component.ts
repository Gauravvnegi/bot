import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { RoomTypes, UpdatedEmitType } from '../../../types/bulk-update.types';

@Component({
  selector: 'hospitality-bot-nested-panel',
  templateUrl: './nested-panel.component.html',
  styleUrls: ['./nested-panel.component.scss'],
})
export class NestedPanelComponent implements OnInit {
  isPanelCollapsed: boolean = true;
  @Input() roomsData: RoomTypes;
  @Output() objectUpdated: EventEmitter<UpdatedEmitType> = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    console.log('***', this.roomsData);
  }

  togglePanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;
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
