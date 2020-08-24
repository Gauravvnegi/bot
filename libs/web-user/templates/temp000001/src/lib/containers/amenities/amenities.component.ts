import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';

@Component({
  selector: 'hospitality-bot-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.scss']
})
export class AmenitiesComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  amenitiesForm: FormGroup;
  
  constructor(
    private _fb: FormBuilder,
    private _amenitiesService: AmenitiesService,
  ) {
    this.initAmenitiesForm();
   }

  ngOnInit(): void {
    this.addFGEvent.next({ name: 'amenities', value: this.amenitiesForm });
  }

  initAmenitiesForm() {
    this.amenitiesForm = this._fb.group({});
  }
}
