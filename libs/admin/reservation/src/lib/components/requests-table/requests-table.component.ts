import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleNames, TableNames } from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Observable } from 'rxjs';
import { RequestTable } from '../../models/request-table.model';
import { ReservationService } from '../../services/reservation.service';

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
  @Input() colorMap;

  actionButtons = false;
  isQuickFilters = false;
  isTabFilters = false;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isPaginator = false;

  cols = [
    { field: 'vin', header: 'Date/Time' },
    { field: 'bookingNumber', header: 'Booking No.' },
    { field: 'type', header: 'Type' },
    { field: 'vin', header: 'Message/Status' },
  ];

  showEmptyView = false;

  constructor(
    public fb: FormBuilder,
    private _reservationService: ReservationService,
    private _adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private _router: Router,
    private _route: ActivatedRoute,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit() {
    this.loadInitialData();
    this.getSubscribedFilters(
      ModuleNames.REQUEST,
      TableNames.REQUEST,
      this.tabFilterItems
    );
  }

  loadInitialData(queries = []) {
    this.loading = true;
    this.fetchDataFrom(queries).subscribe(
      (data) => {
        if (!data) {
          this.showEmptyView = true;
          return;
        }
        this.values = new RequestTable().deserialize(
          { records: data },
          this.colorMap
        ).records;
        //set pagination
        this.totalRecords = data.total;
        this.loading = false;
      },
      ({ error }) => {
        this.loading = false;
        this.snackbarService
          .openSnackBarWithTranslate(
            {
              translateKey: `messages.error.${error?.type}`,
              priorityMessage: error?.message,
            },
            ''
          )
          .subscribe();
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

  updateRequest(status, journey, id) {
    this._reservationService
      .updateRequest(
        this.parentForm.get('reservationDetails').get('bookingId').value,
        {
          journey,
          state: status,
        }
      )
      .subscribe(
        (res) => {
          //update rows
          this.values = this.values.map((row) => {
            if (row.id === id) {
              row.status = 'COMPLETED';
            }
            return row;
          });
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.REQUEST_UPDATED`,
              priorityMessage: 'Request updated successfully',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      );
  }

  goToRequestTable() {
    this._router.navigate(['pages', 'request']);
    //this._router.navigate(['add-user'], { relativeTo: this._route });
  }

  downloadFeedbackPDF(downloadUrl) {
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.target = '_blank';
    link.download = downloadUrl.substring(
      downloadUrl.lastIndexOf('/') + 1,
      downloadUrl.length
    );
    link.click();
    link.remove();
  }
}
