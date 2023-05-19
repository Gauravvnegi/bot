import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  FeedbackService,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { Observable } from 'rxjs';
import { GuestTable } from '../../../data-models/guest-table.model';
import { GuestTableService } from '../../../services/guest-table.service';
import { GuestDatatableComponent } from '../../datatable/guest/guest.component';

@Component({
  selector: 'hospitality-bot-guest-datatable-modal',
  templateUrl: './guest-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    '../../datatable/guest/guest.component.scss',
    './guest-datatable.component.scss',
  ],
})
export class GuestDatatableModalComponent extends GuestDatatableComponent
  implements OnInit, OnDestroy {
  @Input() callingMethod: string;
  @Input() guestFilter: string;
  @Input() exportURL: string;
  @Output() onModalClose = new EventEmitter();
  imageSrc: string;
  constructor(
    public fb: FormBuilder,
    protected _guestTableService: GuestTableService,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    public feedbackService: FeedbackService
  ) {
    super(
      fb,
      _guestTableService,
      _adminUtilityService,
      globalFilterService,
      snackbarService,
      _modal,
      tabFilterService,
      feedbackService
    );
  }

  ngOnInit(): void {
    this.registerListeners();
    this.setEmptyViewImage();
  }

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.initialLoading = false;
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
          this.closeModal();
        }
      )
    );
  }
  setRecords(data): void {
    this.values = new GuestTable().deserialize(data).records;
    this.updateTabFilterCount(data.entityTypeCounts, data.total);
    this.updateQuickReplyFilterCount(data.entityStateCounts);
    this.updateTotalRecords();
    this.loading = false;
  }

  setEmptyViewImage() {
    if (this.tableName === 'Guest Source') {
      this.imageSrc = 'assets/images/empty-table-guest-scource.png';
    } else if (this.tableName === 'Guest Documents') {
      this.imageSrc = 'assets/images/empty-table-guest-documents.png';
    } else {
      this.imageSrc = 'assets/images/empty-table-guest-payment.png';
    }
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

  loadData() {
    this.loading = true;
    // this.updatePaginations(event);
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
          this.setRecords(data);
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
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
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
        }
      )
    );
  }

  closeModal() {
    this.onModalClose.emit(true);
  }
}
