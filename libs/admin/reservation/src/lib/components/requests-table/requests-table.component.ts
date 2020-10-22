import { Component, OnInit, Input } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { FormBuilder } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { ReservationService } from '../../services/reservation.service';
import { Observable } from 'rxjs';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';

@Component({
  selector: 'hospitality-bot-requests-table',
  templateUrl: './requests-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './requests-table.component.scss',
  ],
})
export class RequestsTableComponent extends BaseDatatableComponent {
  @Input('data') detailsData;
  @Input() parentForm;

  actionButtons = false;
  isQuickFilters = false;
  isTabFilters = false;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isPaginaton = false;

  cols = [
    { field: 'rooms.roomNumber', header: 'Date/Time' },
    { field: 'booking.bookingNumber', header: 'Message' },
    { field: 'guests.primaryGuest.firstName', header: 'Category/Type' },
  ];

  constructor(
    public fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminUtilityService: AdminUtilityService,
    private _snackbarService: SnackBarService
  ) {
    super(fb);
  }

  ngOnInit() {
    this.loadInitialData();
  }

  loadInitialData(queries = []) {
    this.loading = true;
    this.fetchDataFrom(queries).subscribe(
      (data) => {
        // debugger;
        // this.values = new ReservationTable().deserialize(data).records;
        //set pagination
        // this.totalRecords = data.total;
        this.loading = false;
      },
      ({ error }) => {
        this.loading = false;
        this._snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: 0, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._reservationService.getRequestsByReservationId(
      this.parentForm.get('reservationDetails').get('bookingId').value,
      config
    );
  }
}
