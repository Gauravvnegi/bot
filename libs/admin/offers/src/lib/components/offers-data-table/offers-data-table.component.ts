import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import * as FileSaver from 'file-saver';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { Subscription } from 'rxjs';
import { chips, cols, title } from '../../constant/data-table';
import routes from '../../constant/routes';
import { Offer, OfferList } from '../../models/offers.model';
import { OffersServices } from '../../services/offers.service';
import { OfferData } from '../../types/offers';
import { OfferListResponse, OfferResponse } from '../../types/response';

@Component({
  selector: 'hospitality-bot-offers-data-table',
  templateUrl: './offers-data-table.component.html',
  styleUrls: [
    './offers-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class OffersDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private offerService: OffersServices,
    private adminUtilityService: AdminUtilityService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  hotelId: string;
  tableName = title;
  cols = cols;
  filterChips = chips;
  readonly routes = routes;
  iQuickFilters = true;
  subscription$ = new Subscription();

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initTableValue();
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.subscription$.add(
      this.offerService
        .getLibraryItems<OfferListResponse>(this.hotelId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const offerList = new OfferList().deserialize(res);
            this.values = offerList.records;
            this.totalRecords = offerList.total;
            this.filterChips.forEach((item) => {
              item.total = offerList.entityStateCounts[item.value];
            });
          },
          ({ error }) => {
            this.values = [];
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
        )
    );
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status: boolean, rowData: Offer): void {
    this.loading = true;
    this.subscription$.add(
      this.offerService
        .updateLibraryItem<Partial<OfferData>, OfferResponse>(
          this.hotelId,
          rowData.id,
          { active: status },
          { params: '?type=OFFER' }
        )
        .subscribe(
          () => {
            const statusValue = (val: boolean) => (val ? 'ACTIVE' : 'INACTIVE');
            this.updateStatusAndCount(
              statusValue(rowData.status),
              statusValue(status)
            );
            this.values.find((item) => item.id === rowData.id).status = status;

            this.snackbarService.openSnackBarAsText(
              'Status changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          type: LibraryItem.offer,
          offset: this.first,
          limit: this.rowsPerPage,
          source: 1,
        },
      ]),
    };
    return config;
  }

  /**
   * @function editOffer To edit the offer.
   * @params rowData
   */
  editOffer(rowData: OfferResponse) {
    this.router.navigate([
      `/pages/library/offers/${routes.createOffer}/${rowData.id}`,
    ]);
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.filterChips.filter(
      (item) => item.isSelected && item.value !== 'ALL'
    );
    return [
      chips.length !== 1
        ? { status: null }
        : { status: chips[0].value === 'ACTIVE' },
    ];
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        { type: LibraryItem.offer },
      ]),
    };
    this.subscription$.add(
      this.offerService.exportCSV(this.hotelId, config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        this.handleError,
        this.handleFinal
      )
    );
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
