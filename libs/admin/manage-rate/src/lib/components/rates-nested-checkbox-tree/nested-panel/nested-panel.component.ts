import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { RoomTypes, UpdatedEmitType } from '../../../types/bulk-update.types';

@Component({
  selector: 'hospitality-bot-nested-panel',
  templateUrl: './nested-panel.component.html',
  styleUrls: ['./nested-panel.component.scss'],
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
    switch (source) {
      case 'parent':
        this.roomsData.isSelected = status;
        this.changeChildrenStatus(this.roomsData);
        break;
      case 'variant':
        this.roomsData.variants[variantIndex].isSelected = status;
        this.roomsData.isSelected = this.roomsData.variants.every(
          (item) => item.isSelected
        );
        this.changeChildrenStatus(this.roomsData.variants[variantIndex]);
        break;
      case 'channel':
        this.roomsData.variants[variantIndex].channels[
          channelIndex
        ].isSelected = status;
        this.roomsData.variants[
          variantIndex
        ].isSelected = this.roomsData.variants[variantIndex].channels.every(
          (item) => item.isSelected
        );

        this.roomsData.isSelected = this.roomsData.variants.every(
          (item) => item.isSelected
        );
        this.changeChildrenStatus(
          this.roomsData.variants[variantIndex].channels[channelIndex]
        );
        break;
    }

    this.objectUpdated.emit({
      status: status,
      id: id,
      source: source,
      variantIndex: variantIndex,
      channelIndex: channelIndex,
    } as UpdatedEmitType);
  }
  private changeChildrenStatus(parent) {
    const stack = [parent];
    while (stack.length > 0) {
      const current = stack.pop();
      if ('variants' in current) {
        current.variants.forEach((variant) => {
          variant.isSelected = current.isSelected;
          variant.channels.forEach((channel) => {
            channel.isSelected = current.isSelected;
          });
          stack.push(variant);
        });
      } else if ('channels' in current) {
        current.channels.forEach((channel) => {
          channel.isSelected = current.isSelected;
        });
      }
    }
  }
}
