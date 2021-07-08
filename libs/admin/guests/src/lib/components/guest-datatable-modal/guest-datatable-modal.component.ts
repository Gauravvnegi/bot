import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { GuestTable } from '../../data-models/guest-table.model';
import { GuestTableService } from '../../services/guest-table.service';
import { GuestDatatableComponent } from '../guest-datatable/guest-datatable.component';
import * as FileSaver from 'file-saver';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';

@Component({
  selector: 'hospitality-bot-guest-datatable-modal',
  templateUrl: './guest-datatable-modal.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    '../guest-datatable/guest-datatable.component.scss',
    './guest-datatable-modal.component.scss',
  ],
})
export class GuestDatatableModalComponent extends GuestDatatableComponent
  implements OnInit {
  @Input() callingMethod: string;
  @Input() guestFilter: string;
  @Input() exportURL: string;
  @Output() onModalClose = new EventEmitter();
  constructor(
    public fb: FormBuilder,
    protected _guestTableService: GuestTableService,
    protected _adminUtilityService: AdminUtilityService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    public feedbackService: FeedbackService
  ) {
    super(
      fb,
      _guestTableService,
      _adminUtilityService,
      _globalFilterService,
      _snackbarService,
      _modal,
      tabFilterService,
      feedbackService
    );
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new GuestTable().deserialize(data).records;
          this.initialLoading = false;
          //set pagination
          this.totalRecords = data.total;
          data.entityTypeCounts &&
            this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
          data.entityStateCounts &&
            this.updateQuickReplyFilterCount(data.entityStateCounts);

          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
          this.closeModal();
        }
      )
    );
  }

  fetchDataFrom(
    queries,
    defaultProps = {
      offset: this.first,
      limit: this.rowsPerPage,
      guestFilter: this.guestFilter,
    }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._guestTableService[this.callingMethod](config);
  }

  loadData(event: LazyLoadEvent) {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: this.tabFilterItems[this.tabFilterIdx].value,
          },
          ...this.getSelectedQuickReplyFilters(),
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
          guestFilter: this.guestFilter,
        }
      ).subscribe(
        (data) => {
          this.values = new GuestTable().deserialize(data).records;

          //set pagination
          this.totalRecords = data.total;
          //check for update tabs and quick reply filters
          data.entityTypeCounts &&
            this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
          data.entityStateCounts &&
            this.updateQuickReplyFilterCount(data.entityStateCounts);
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
          this.closeModal();
        }
      )
    );
  }

  exportCSV() {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
          guestFilter: this.guestFilter,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item.booking.bookingId })),
      ]),
    };
    this.$subscription.add(
      this._guestTableService[this.exportURL || 'exportCSV'](config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            this.tableName.toLowerCase() +
              '_export_' +
              new Date().getTime() +
              '.csv'
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  closeModal() {
    this.onModalClose.emit(true);
  }
}
