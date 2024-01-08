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
  BookingDetailService,
  FeedbackService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { Observable } from 'rxjs';
import {
  GuestDocsOrPayment,
  GuestTable,
} from '../../../data-models/guest-table.model';
import { GuestTableService } from '../../../services/guest-table.service';
import { GuestDatatableComponent } from '../../datatable/guest/guest.component';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { guestStatusDetails } from '../../../constants/guest';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { GuestDialogData, GuestModalType } from '../../../types/guest.type';
import { TranslateService } from '@ngx-translate/core';

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
  isAllTabFilterRequired = true;
  modalType?: GuestModalType;
  @Input() callingMethod: 'getGuestDocsOrPaymentStats' | 'getAllGuestStats';
  @Input() guestFilter: string;
  @Input() exportURL: string;
  @Input() entityType: string;
  @Output() onModalClose = new EventEmitter();
  imageSrc: string;
  isNpsColHidden: Boolean = false;

  constructor(
    public fb: FormBuilder,
    protected _guestTableService: GuestTableService,
    protected _adminUtilityService: AdminUtilityService,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected _modal: ModalService,
    public feedbackService: FeedbackService,
    private router: Router,
    public bookingDetailService: BookingDetailService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig, // generic is not supported in v10
    public _translateService: TranslateService
  ) {
    super(
      fb,
      _guestTableService,
      _adminUtilityService,
      globalFilterService,
      snackbarService,
      _modal,
      feedbackService,
      bookingDetailService
    );

    const data = config.data as GuestDialogData;
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        this[key] = value;
      });
    }

    if (this.callingMethod === 'getGuestDocsOrPaymentStats') {
      this.isAllTabFilterRequired = false;
      this.isNpsColHidden = true;
      this.cols = this.cols.filter(
        (item) => item.field !== 'guestAttributes.overAllNps'
      );
    }
  }

  ngOnInit(): void {
    this.registerListeners();
    this.setEmptyViewImage();
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.closeModal();
      });
    this._translateService
      .get(this.modalType)
      .subscribe((message) => (this.tableName = message));
  }

  loadInitialData(queries = [], loading = true) {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries, {
        offset: this.first,
        limit: this.rowsPerPage,
        guestFilter: this.guestFilter,
        type: 'GUEST',
      }).subscribe(
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
    if (this.callingMethod === 'getGuestDocsOrPaymentStats') {
      const guestRecord = new GuestDocsOrPayment().deserialize(data);
      this.values = guestRecord.records;
      this.initFilters(
        {},
        guestRecord.entityStateCounts,
        guestRecord.totalRecord
      );
      this.loading = false;
      return;
    }

    const guestRecord = new GuestTable().deserialize(data);
    this.values = guestRecord.records;
    this.initFilters(
      guestRecord.entityTypeCounts,
      guestRecord.entityStateCounts,
      guestRecord.totalRecord,
      guestStatusDetails
    );
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

  fetchDataFrom(queries, defaultProps): Observable<any> {
    if (this.entityType) {
      queries.forEach((item) => {
        if (item.hasOwnProperty('entityType')) {
          item['entityType'] = this.entityType;
        }
      });
    }
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
          ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
          guestFilter: this.guestFilter,
          type: 'GUEST',
        }
      ).subscribe(
        (data) => {
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
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
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
    this.ref.close();
    this.onModalClose.emit(true);
  }
}
