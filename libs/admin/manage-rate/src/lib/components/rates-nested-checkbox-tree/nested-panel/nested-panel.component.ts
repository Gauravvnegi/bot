import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormGroup,
} from '@angular/forms';
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
  @Input() roomsData: FormGroup;
  @Output() objectUpdated: EventEmitter<UpdatedEmitType> = new EventEmitter();
  parentHeadingStyle = {
    'font-size': '14px',
    'font-weight': 'bold',
  };
  onRoomChange(
    status: boolean,
    id: string,
    source: 'parent' | 'variant' | 'channel' | 'pax',
    variantIndex?: number,
    channelIndex?: number
  ) {
    const otherVariantConfig = (
      type: 'channels' | 'pax',
      index: number,
      status: boolean
    ) => {
      this.roomsData
        .get(`variants.${variantIndex}.${type}.${index}.isSelected`)
        .setValue(status);

      const variant = this.roomsData.get(
        `variants.${variantIndex}`
      ) as FormGroup;

      this.updateParentSelected(variant, 'pax');
      this.updateParentSelected(this.roomsData, 'variants');

      const targetFormGroup = this.roomsData.get(
        `variants.${variantIndex}.${type}.${index}`
      ) as FormGroup;

      this.changeChildrenStatus(targetFormGroup);
    };

    switch (source) {
      case 'parent':
        this.roomTypeParentControl.isSelected.patchValue(status);
        this.changeChildrenStatus(this.roomsData);
        break;
      case 'variant':
        this.variantControls
          .at(variantIndex)
          .get('isSelected')
          .patchValue(status);

        this.roomTypeParentControl.isSelected.patchValue(
          this.variantControls.controls.every(
            (item) => item.get('isSelected').value
          )
        );
        this.changeChildrenStatus(
          this.variantControls.at(variantIndex) as FormGroup
        );
        break;
      case 'channel':
        otherVariantConfig('channels', channelIndex, status);
        break;
      case 'pax':
        otherVariantConfig('pax', channelIndex, status);
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

  private changeChildrenStatus(formGroup: FormGroup) {
    const stack: AbstractControl[] = [formGroup];

    while (stack.length > 0) {
      const current = stack.pop();

      if (current instanceof FormGroup) {
        const variantsControl = current.get('variants') as FormArray;
        if (variantsControl instanceof FormArray) {
          const variants = variantsControl.controls;

          variants.forEach((variant) => {
            if (variant instanceof FormGroup) {
              variant
                .get('isSelected')
                .setValue(current.get('isSelected').value);

              const channelsControl = variant.get('channels') as FormArray;
              if (channelsControl instanceof FormArray) {
                const channels = channelsControl.controls;
                channels.forEach((channel) => {
                  channel
                    .get('isSelected')
                    .setValue(current.get('isSelected').value);
                });
              }
              stack.push(variant);
            }
          });
        }

        const paxControl = current.get('pax') as FormArray;
        if (paxControl instanceof FormArray) {
          const pax = paxControl.controls;
          pax.forEach((paxControl) => {
            paxControl
              .get('isSelected')
              .setValue(current.get('isSelected').value);
          });
        }

        const channelsControl = current.get('channels') as FormArray;
        if (channelsControl instanceof FormArray) {
          const channels = channelsControl.controls;
          channels.forEach((channel) => {
            channel.get('isSelected').setValue(current.get('isSelected').value);
          });
        }
      }
    }
  }

  private updateParentSelected(
    control: FormGroup,
    key: 'variants' | 'channels' | 'pax' = 'variants'
  ): void {
    const parentSelected =
      control.get(key) &&
      (control.get(key) as FormArray).controls.every(
        (variant) => variant.get('isSelected').value
      );
    control.get('isSelected').patchValue(parentSelected, { emitEvent: false });
  }

  get roomTypeParentControl() {
    return this.roomsData.controls as Record<
      keyof RoomTreeDataType,
      AbstractControl
    >;
  }

  get variantControls() {
    return this.roomTypeParentControl.variants as FormArray;
  }
}

type RoomTreeDataType = {
  id: string;
  label: string;
  isSelected: boolean;
  variants: FormArray;
};
