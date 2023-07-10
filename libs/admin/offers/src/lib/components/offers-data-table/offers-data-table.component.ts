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

  entityId: string;
  tableName = title;
  cols = cols;
  filterChips = chips;
  readonly routes = routes;
  iQuickFilters = true;
  isAllTabFilterRequired = true;
  subscription$ = new Subscription();

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
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
    this.loading = true;
    this.subscription$.add(
      this.offerService
        .getLibraryItems<OfferListResponse>(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const data = new OfferList().deserialize(res);
            this.values = data.records;
            this.initFilters(
              data.entityTypeCounts,
              data.entityStateCounts,
              data.totalRecord
            );
          },
          ({ error }) => {
            this.values = [];
          },
          this.handleFinal
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
          this.entityId,
          rowData.id,
          { active: status },
          { params: '?type=OFFER' }
        )
        .subscribe(() => {
          this.initTableValue();
          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
          this.loading = false;
        }, this.handleFinal)
    );
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFiltersV2({ isStatusBoolean: true }),
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
      this.offerService.exportCSV(this.entityId, config).subscribe((res) => {
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
        this.loading = false;
      }, this.handleFinal)
    );
  }

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
