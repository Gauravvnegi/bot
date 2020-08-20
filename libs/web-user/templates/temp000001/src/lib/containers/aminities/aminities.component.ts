import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AmenitiesService } from 'libs/web-user/shared/src/lib/services/amenities.service';

@Component({
  selector: 'hospitality-bot-aminities',
  templateUrl: './aminities.component.html',
  styleUrls: ['./aminities.component.scss']
})
export class AminitiesComponent implements OnInit {

  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addAmenitiesFGEvent = new EventEmitter();
  
  constructor(
    private _amenitiesService: AmenitiesService,
  ) { }

  ngOnInit(): void {
  }
}
