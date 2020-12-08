import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';

@Component({
  selector: 'hospitality-bot-complimentary-amenities',
  templateUrl: './complimentary-amenities.component.html',
  styleUrls: ['./complimentary-amenities.component.scss']
})
export class ComplimentaryAmenitiesComponent implements OnInit {

  @Input() parentForm;

  constructor(
    private _fb: FormBuilder,
    private _complimentaryService: ComplimentaryService
  ) { }

  ngOnInit(): void {
    this.addComplimentaryServicesToForm();
  }

  addComplimentaryServicesToForm() {
    this.hotelComplimentaryAmenities.forEach((service) => {
      this.parentForm.controls.push(
        this.getComplimentaryServicesFG()
      );
    });
    this.parentForm.patchValue( this.hotelComplimentaryAmenities);
  }

  getComplimentaryServicesFG() {
    return this._fb.group({
      id: [''],
      rate: [''],
      currencyCode: [''],
      packageCode: [''],
      imgUrl: [''],
      name: [''],
      active:[''],
      hasChild:[''],
      description:[''],
      unit:[''],
      type:[''],
      source:['']
    });
  }

  get hotelComplimentaryAmenities(){
    return this._complimentaryService.complimentaryAmenities && 
    this._complimentaryService.complimentaryAmenities.complimentaryService;
  }
}
