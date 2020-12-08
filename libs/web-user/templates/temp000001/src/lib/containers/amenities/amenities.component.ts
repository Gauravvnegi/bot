import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';
import { ComplimentaryService } from 'libs/web-user/shared/src/lib/services/complimentary.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';

@Component({
  selector: 'hospitality-bot-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss']
})
export class AmenitiesComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Output() addFGEvent = new EventEmitter();

  amenitiesForm: FormGroup;
  
  constructor(
    private _fb: FormBuilder,
    private _amenitiesService: AmenitiesService,
    private _complimentaryService: ComplimentaryService,
    private _paidService: PaidService,
  ) {
    this.initAmenitiesForm();
   }

  ngOnInit(): void {
    this.addFGEvent.next({ name: 'amenities', value: this.amenitiesForm });
    this.initPaidServiceDetailDS();
    this.initComplimentaryDetailDS();
  }

  initAmenitiesForm() {
    this.amenitiesForm = this._fb.group({
      complimentaryServices: new FormArray([]),
      paidServices: new FormGroup({})
    });
  }

  initPaidServiceDetailDS(){
    this._complimentaryService.initComplimentaryAmenitiesDetailDS(
      this.amenities && this.amenities.complimentaryServicesDetail
    );
  }

  initComplimentaryDetailDS(){
    this._paidService.initPaidAmenitiesDetailDS(
      this.amenities && this.amenities.paidServicesDetail,
      this.reservationData.packages.paidPackages,
      this.arrivalTime
    );
  }

  get complimentaryServicesForm(){
    return this.amenitiesForm.get('complimentaryServices') as FormGroup;
  }

  get paidServicesForm(){
    return this.amenitiesForm.get('paidServices') as FormGroup;
  }

  get amenities(){
    return this._amenitiesService.amenities.amenities;
  }

  get arrivalTime(){
    return this._amenitiesService.amenities.arrivalTime;
  }
}
