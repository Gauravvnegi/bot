import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-airport-pickup',
  templateUrl: './airport-pickup.component.html',
  styleUrls: [
    '../default-package/default-package.component.scss',
    './airport-pickup.component.scss',
  ],
})
export class AirportPickupComponent implements OnInit {
  @Input() parentForm;
  @Input() paidAmenityFG: FormGroup;
  @Input() config;
  @Input() index;

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.addMetaData();
  }

  addMetaData() {
    this.paidAmenityFG.addControl('metaData', this.getAirportPickupFG());
    this.paidAmenityFG.patchValue({ metaData: this.config.metaData });
  }

  getAirportPickupFG() {
    return this._fb.group({
      airportName: [''],
      terminal: [''],
      flightNumber: [''],
      quantity: [''],
    });
  }

  get metaDataFG() {
    return this.paidAmenityFG.get('metaData') as FormGroup;
  }
}
