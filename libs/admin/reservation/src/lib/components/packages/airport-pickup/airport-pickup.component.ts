import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultPackageComponent } from '../default-package/default-package.component';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from '../../../services/reservation.service';
import { DateService } from '@hospitality-bot/shared/utils';

@Component({
  selector: 'hospitality-bot-airport-pickup',
  templateUrl: './airport-pickup.component.html',
  styleUrls: [
    '../default-package/default-package.component.scss',
    './airport-pickup.component.scss',
  ],
})
export class AirportPickupComponent extends DefaultPackageComponent
  implements OnInit {
  constructor(
    private _fb: FormBuilder,
    protected snackbarService: SnackBarService,
    protected reservationService: ReservationService
  ) {
    super(snackbarService, reservationService);
  }

  ngOnInit(): void {
    this.addMetaData();
  }

  addMetaData() {
    this.paidAmenityFG.addControl('metaData', this.getAirportPickupFG());

    this.paidAmenityFG.patchValue({
      metaData: {
        ...this.config.metaData,
        pickupTime: DateService.getDateFromTimeStamp(
          this.config.metaData.pickupTime * 1000,
          'DD-MM-YYYY hh:mm a'
        ),
      },
    });
  }

  getAirportPickupFG() {
    return this._fb.group({
      airportName: [''],
      terminal: [''],
      flightNumber: [''],
      quantity: [''],
      pickupTime: [''],
    });
  }

  get metaDataFG() {
    return this.paidAmenityFG.get('metaData') as FormGroup;
  }
}
