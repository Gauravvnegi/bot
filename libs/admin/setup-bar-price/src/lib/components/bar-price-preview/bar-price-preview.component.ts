import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Accordion } from 'primeng/accordion';
import { BarPriceFormData, RatePlan } from '../../types/bar-price-preview.type';

@Component({
  selector: 'hospitality-bot-bar-price-preview',
  templateUrl: './bar-price-preview.component.html',
  styleUrls: ['./bar-price-preview.component.scss']
})
export class BarPricePreviewComponent implements OnInit {
  @Input() useForm!:FormGroup;
  allFormData!:BarPriceFormData;

  constructor() { }

  ngOnInit(): void { 
    this.allFormData = this.useForm.getRawValue();
    console.log(this.allFormData);
  } 

  getRates(ratePlans:RatePlan[],emptyId:boolean){
   return ratePlans.filter((item)=> emptyId ? !item.id.length : item.id.length)
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
