import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import {
  RoomTypes,
  UpdatedEmitType,
  SourceEmitType,
} from '../../types/bulk-update.types';
@Component({
  selector: 'hospitality-bot-nested-checkbox-tree',
  templateUrl: './nested-checkbox-tree.component.html',
  styleUrls: ['./nested-checkbox-tree.component.scss'],
})
export class NestedCheckboxTreeComponent extends FormComponent {
  isPanelCollapsed: boolean = true;
  @Input() roomsData: RoomTypes[];
  @Output() objectChanged: EventEmitter<RoomTypes[]> = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}

  togglePanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }

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
    this.objectChanged.emit(this.roomsData);
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
