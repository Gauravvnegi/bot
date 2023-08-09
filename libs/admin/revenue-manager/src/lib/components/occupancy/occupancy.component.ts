import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { weeks } from 'libs/admin/channel-manager/src/lib/components/constants/bulkupdate-response';

export type ControlTypes = 'season' | 'occupancy';

@Component({
  selector: 'hospitality-bot-occupancy',
  templateUrl: './occupancy.component.html',
  styleUrls: ['./occupancy.component.scss'],
})
export class OccupancyComponent {
  loading = false;
  footerNote = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Error eos
  alias consequuntur necessitatibus dolore, fugit eligendi, exercitationem
  quia iste nemo nulla eveniet, doloribus sit vero? Laboriosam inventore
  deleniti autem illum!`;
  private parentForm: FormGroup;

  @Input() set dynamicPricingFG(form: FormGroup) {
    if (form) {
      this.parentForm = form;
      this.listenChanges();
    }
  }

  @Input() season: FormGroup;
  @Input() occupancy: FormGroup;
  weeks = weeks;

  get dynamicPricingFG(): FormGroup {
    return this.parentForm;
  }

  get dynamicPricingControl() {
    return this.dynamicPricingFG?.controls as Record<
      'occupancyFA',
      AbstractControl
    > & {
      occupancyFA: FormArray;
    };
  }

  seasonStatusChange(status, seasonIndex: number) {
    this.dynamicPricingControl.occupancyFA
      .at(seasonIndex)
      .patchValue({ status: status });
  }

  add(type: ControlTypes, formGroup?: FormGroup) {
    switch (type) {
      case 'season':
        this.dynamicPricingControl.occupancyFA.push(this.season);
        break;
      case 'occupancy':
        (formGroup?.get('occupancy') as FormArray).push(this.occupancy);
        break;
    }
    this.listenChanges();
  }

  remove(type: ControlTypes, index: number, roomType?: FormGroup) {
    switch (type) {
      case 'season':
        this.dynamicPricingControl.occupancyFA.removeAt(index);
        break;
      case 'occupancy':
        (roomType.get('occupancy') as FormArray).removeAt(index);
        break;
    }
  }

  listenChanges() {
    this.dynamicPricingControl?.occupancyFA.controls.forEach(
      (seasonFG: FormGroup) => {
        //roomType change listening
        const roomTypeFG = seasonFG.get('roomTypes') as FormArray;
        seasonFG.get('roomType').valueChanges.subscribe((res: string[]) => {
          roomTypeFG.controls.forEach((roomType: FormGroup, index) => {
            roomType.patchValue({
              isSelected: res.includes(roomType.get('roomId').value),
            });
          });
        });

        roomTypeFG.controls.forEach((roomTypeFG: FormGroup) => {
          const basePrice = roomTypeFG.get('basePrice').value;

          //occupancy change listening
          (roomTypeFG.get('occupancy') as FormArray).controls.forEach(
            (occupancyFG: FormGroup) => {
              occupancyFG
                .get('discount')
                .valueChanges.subscribe((percentage) => {
                  occupancyFG.patchValue(
                    { rate: (basePrice * +percentage) / 100 },
                    { emitEvent: false }
                  );
                });

              occupancyFG.get('rate').valueChanges.subscribe((rate) => {
                const percentage = (+rate / basePrice) * 100;
                occupancyFG.patchValue(
                  { discount: percentage.toFixed(2) },
                  { emitEvent: false }
                );
              });

              const { start, end } = occupancyFG.controls;
              const customError = { min: 'Start should be less than end.' };
              start.valueChanges.subscribe((startValue) => {
                const condition = end.value && +startValue > end.value;
                start.setErrors(condition ? customError : null);
                end.setErrors(condition && null);
              });

              end.valueChanges.subscribe((endValue) => {
                const condition = start.value && +endValue < start.value;
                end.setErrors(condition ? customError : null);
                start.setErrors(condition && null);
              });
            }
          );
        });
      }
    );
  }

  handleSave() {
    console.log(this.dynamicPricingControl.occupancyFA);
    debugger;
  }
}
