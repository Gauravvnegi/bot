import { Component, OnInit } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { FormBuilder } from '@angular/forms';
import { SpecialAmenitiesService } from '../../../../../special-amenities/src/lib/services/special-amenities.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'hospitality-bot-reservation-datatable',
  templateUrl: './reservation-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './reservation-datatable.component.scss',
  ],
})
export class ReservationDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Reservations';
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;

  // cols = [
  //   { field: 'imgUrl', header: 'Package Image' },
  //   { field: 'amenityName', header: 'Package Name' },
  //   { field: 'amenityDescription', header: 'Description' },
  //   { field: 'type', header: 'Type' },
  //   { field: 'rate', header: 'Amount' },
  //   { field: 'active', header: 'Status' },
  //   { field: 'packageCode', header: 'Package Code' },
  // ];
  constructor(
    public fb: FormBuilder,
    private _amenitiesService: SpecialAmenitiesService
  ) {
    super(fb);
  }

  // fetchDataFrom(
  //   config = { first: 0, rows: this.rowsPerPage }
  // ): Observable<any> {
  //   return this._amenitiesService.getAmenityPackages(
  //     'ca60640a-9620-4f60-9195-70cc18304edd',
  //     config.first,
  //     config.rows
  //   );
  // }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
