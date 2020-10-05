import { Component, OnInit } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { FormBuilder } from '@angular/forms';
import { SpecialAmenitiesService } from '../../../../../special-amenities/src/lib/services/special-amenities.service';
import { Observable } from 'rxjs';
import { ReservationService } from '../../services/reservation.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { LazyLoadEvent, SortEvent } from 'primeng/api/public_api';
import { ReservationTable } from '../../data-models/reservation-table.model';

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
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;

  cols = [
    { field: 'rooms', header: 'Rooms' },
    { field: 'bookingId', header: 'Booking No.' },
    { field: 'guestOrCompany', header: 'Guest/company' },
    { field: 'arrivalAndDepartureDate', header: 'Arrival Date-Departure Date' },
    { field: 'amountDueAndTotal', header: 'Amount Due/Total(INR)' },
    { field: 'package', header: 'Package' },
    { field: 'stageAndourney', header: 'Stage/Journey' },
  ];

  triggerInitialData = false;
  globalQueries = [];
  constructor(
    public fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this._globalFilterService.globalFilter$.subscribe((data) => {
      const queries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];

      this.globalQueries = [...queries];

      this.loadInitialData([
        ...this.globalQueries,
        { order: 'DESC', entityType: 'ARRIVAL', entityState: 'ALL' },
      ]);
    });
  }

  loadInitialData(queries = []) {
    this.loading = true;
    this.fetchDataFrom(queries).subscribe((data) => {
      this.values = new ReservationTable().deserialize(data).records;
      //   this.values = data.records;
      //setting pagination
      this.totalRecords = data.total;
      this.loading = false;
    });
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: 0, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._reservationService.getReservationDetails(config);
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;

    this.fetchDataFrom(
      [
        ...this.globalQueries,
        { order: 'DESC', entityType: 'ARRIVAL', entityState: 'ALL' },
      ],
      { offset: event.first, limit: event.rows }
    ).subscribe((data) => {
      this.values = new ReservationTable().deserialize(data).records;

      //setting pagination
      this.totalRecords = data.total;
      this.loading = false;
    });
  }

  customSort(event: SortEvent) {
    event.data.sort((data1, data2) => {
      let value1 = data1[event.field];
      let value2 = data2[event.field];
      let result = null;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

      return event.order * result;
    });
  }
}
