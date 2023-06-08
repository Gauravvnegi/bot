import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TableValue, chips, cols, filters, records, title } from '../../constants/data-table';
import { Subscription } from 'rxjs';
import { OutletService } from '../../services/outlet.service';
import { LazyLoadEvent } from 'primeng/api';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { outletRoutes } from '../../constants/route';

@Component({
  selector: 'hospitality-bot-all-outlets-data-table',
  templateUrl: './all-outlets-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './all-outlets-data-table.component.scss',
  ],
})

export class AllOutletsDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly outletRoutes = outletRoutes;

  outletId: string;
  tabFilterItems = filters;
  tableName = title;
  filterChips = chips;
  cols = cols;
  isQuickFilters = true;
  selectedTable: TableValue;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private outletService: OutletService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.listenToTableChange();
  }

  /**
   * @function listenToTableChange  To listen to table changes
   */
  listenToTableChange() {
    this.outletService.selectedTable.subscribe((value) => {
      this.selectedTable = value;
      this.initTableValue();
    });
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  // Mock Data for now
  initTableValue() {
    // this.loading = true;
    this.values = records;

    // this.outletService
    //   .getAllOutlets<OutletListResponse>(this.hotelId)
    //   .subscribe(
    //     (res) => {
    //       const outletList = new OutletList().deserialize(res);
    //       switch (this.selectedTable) {
    //         case TableValue.ALL:
    //           this.values = outletList.allOutlets;
    //           break;
    //         case TableValue.BANQUET:
    //           this.values = outletList.banquets;
    //           break;
    //         case TableValue.BAR:
    //           this.values = outletList.bar;
    //           break;
    //         case TableValue.CONFERENCE_ROOM:
    //           this.values = outletList.conferenceRoom;
    //           break;
    //         case TableValue.RESTAURANT:
    //           this.values = outletList.restaurant;
    //           break;
    //       }
    //       this.updateTabFilterCount(res.entityTypeCounts, res.total);
    //       this.updateQuickReplyFilterCount(res.entityStateCounts);
    //       this.updateTotalRecords();
    //     },
    //     () => {
    //       this.values = [];
    //       this.loading = false;
    //     },
    //     this.handleFinal
    //   );
  }

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
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status, rowData): void {
    // Not working
    this.loading = true;
    this.$subscription.add(
      this.outletService
        .updateOutletItem(rowData.id, status)
        .subscribe(
          () => {
            this.updateStatusAndCount(rowData.status, status);

            this.snackbarService.openSnackBarAsText(
              'Status changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          ({ error }) => {},
          this.handleFinal
        )
    );
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.outletService.selectedTable.next(
      this.tabFilterItems[event.index].value
    );
    this.tabFilterIdx = event.index;
    this.initTableValue();
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    // const config: QueryConfig = {
    //   params: this.adminUtilityService.makeQueryParams([
    //     ...this.selectedRows.map((item) => ({ ids: item.id })),
    //
    //   ]),
    // };
    this.$subscription.add(
      this.outletService.exportCSV(this.outletId).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
        },
        () => {},
        this.handleFinal
      )
    );
  }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
