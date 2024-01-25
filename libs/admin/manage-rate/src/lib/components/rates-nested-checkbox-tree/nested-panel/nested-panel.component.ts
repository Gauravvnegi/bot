import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  RoomTypes,
  UpdatedEmitType,
} from 'libs/admin/channel-manager/src/lib//types/bulk-update.types';

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
    source: 'parent' | 'variant' | 'channel' | 'pax',
    variantIndex?: number,
    channelIndex?: number
  ) {
    const otherVariantConfig = (type: 'channels' | 'pax', index: number) => {
      this.roomsData.variants[variantIndex][type][index].isSelected = status;
      this.roomsData.variants[
        variantIndex
      ].isSelected = this.roomsData.variants[variantIndex][type].every(
        (item) => item.isSelected
      );

      this.roomsData.isSelected = this.roomsData.variants.every(
        (item) => item.isSelected
      );
      this.changeChildrenStatus(
        this.roomsData.variants[variantIndex][type][index]
      );
    };

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
        otherVariantConfig('channels', channelIndex);
        break;
      case 'pax':
        otherVariantConfig('pax', channelIndex);
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
      }
      if ('pax' in current) {
        current.pax.forEach((pax) => {
          pax.isSelected = current.isSelected;
        });
      }

      if ('channels' in current) {
        current.channels.forEach((channel) => {
          channel.isSelected = current.isSelected;
        });
      }
    }
  }
}
