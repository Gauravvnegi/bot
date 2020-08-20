import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AirportService } from 'libs/web-user/shared/src/lib/services/airport.service';
import { AirportConfigI } from 'libs/web-user/shared/src/lib/data-models/airportConfig.model';

@Component({
  selector: 'hospitality-bot-airport-pickup',
  templateUrl: './airport-pickup.component.html',
  styleUrls: ['./airport-pickup.component.scss']
})
export class AirportPickupComponent implements OnInit {

  airportForm: FormGroup;
  airportConfig: AirportConfigI;

  constructor(
    private _fb: FormBuilder,
    private _airportService: AirportService
  ) {
    this.initAirportForm();
   }

  ngOnInit(): void {
    this.airportConfig = this.setFieldConfiguration();
  }

  initAirportForm() {
    this.airportForm = this._fb.group({
      airportName: ['', [Validators.required]],
      terminal: ['', [Validators.required]],
      flightNumber: ['', [Validators.required]],
      pickupTime: ['', [Validators.required]],
    });
  }

  setFieldConfiguration() {
    return this._airportService.setFieldConfigForAirportDetails();
  }
}
