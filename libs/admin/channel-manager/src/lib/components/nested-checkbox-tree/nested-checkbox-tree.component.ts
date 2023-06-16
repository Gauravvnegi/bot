import { Component, Input } from '@angular/core';
import { RoomTypes, UpdatedEmitType } from '../../types/bulk-update.types';
@Component({
  selector: 'hospitality-bot-nested-checkbox-tree',
  templateUrl: './nested-checkbox-tree.component.html',
  styleUrls: ['./nested-checkbox-tree.component.scss'],
})
export class NestedCheckboxTreeComponent {
  @Input() roomsData: RoomTypes[];

  constructor() {}

  onRoomChange(event: UpdatedEmitType, objectIndex: number) {
    const currentObject = this.roomsData[objectIndex];
    switch (event.source) {
      case 'parent':
        currentObject.isSelected = event.status;
        this.changeChildrenStatus(currentObject);
        break;
      case 'variant':
        currentObject.variants[event.variantIndex].isSelected = event.status;
        currentObject.isSelected = currentObject.variants.every(
          (item) => item.isSelected
        );
        this.changeChildrenStatus(currentObject.variants[event.variantIndex]);
        break;
      case 'channel':
        currentObject.variants[event.variantIndex].channels[
          event.channelIndex
        ].isSelected = event.status;
        currentObject.variants[
          event.variantIndex
        ].isSelected = currentObject.variants[
          event.variantIndex
        ].channels.every((item) => item.isSelected);

        currentObject.isSelected = currentObject.variants.every(
          (item) => item.isSelected
        );
        this.changeChildrenStatus(
          currentObject.variants[event.variantIndex].channels[
            event.channelIndex
          ]
        );
        break;
    }
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
