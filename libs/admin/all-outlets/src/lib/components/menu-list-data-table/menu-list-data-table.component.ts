import { Component, OnInit } from '@angular/core';
import { outletRoutes } from '../../constants/routes';
import {
  MenuTabValue,
  chips,
  cols,
  filters,
  menuList,
} from '../../constants/data-table';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as FileSaver from 'file-saver';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { OutletService } from '../../services/outlet.service';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'hospitality-bot-menu-list-data-table',
  templateUrl: './menu-list-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './menu-list-data-table.component.scss',
  ],
})
export class MenuListDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  readonly outletRoutes = outletRoutes;

  outletId: string;
  tabFilterItems = filters;
  tableName = 'Menu List';
  filterChips = chips;
  cols = cols['MENU_LIST'];
  isQuickFilters = true;
  selectedTable: MenuTabValue;

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
    this.outletService.selectedMenuTable.subscribe((value) => {
      this.selectedTable = value;
      this.initTableValue();
    });
  }

  // Mock Data for now
  initTableValue() {
    // this.loading = true;
    this.values = menuList;
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
      this.outletService.updateOutletItem(rowData.id, status).subscribe(
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
