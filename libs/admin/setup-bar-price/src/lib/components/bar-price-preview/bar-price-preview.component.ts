import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Accordion } from 'primeng/accordion';
import { BarPriceFormData, RatePlan } from '../../types/bar-price-preview.type';

@Component({
  selector: 'hospitality-bot-bar-price-preview',
  templateUrl: './bar-price-preview.component.html',
  styleUrls: ['./bar-price-preview.component.scss'],
})
export class BarPricePreviewComponent implements OnInit {
  @Input() useForm!: FormGroup;
  allFormData!: BarPriceFormData;
  selectedRooms!: string[];

  constructor() {}

  ngOnInit(): void {
    this.allFormData = this.useForm.getRawValue();
    this.selectedRooms = this.allFormData.roomType;
    this.allFormData.barPrices = this.allFormData.barPrices.filter((item) =>
      this.selectedRooms.includes(item.id)
    );
  }

  getRates(ratePlans: RatePlan[], emptyId: boolean) {
    return ratePlans.filter((item) =>
      emptyId ? !item.id.length : item.id.length
    );
  }

  /** Getters */
  get useFormControl() {
    return this.useForm.controls as Record<
      'roomType' | 'barPrices' | 'roomTypes',
      AbstractControl
    > & {
      roomTypes: FormArray;
      barPrices: FormArray;
    };
  }
}
