import { Component, OnInit } from '@angular/core';
import { companyRoutes } from '../../constants/route';
import { chips, cols, title } from '../../constants/datatable';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  QueryConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { CompanyService } from '../../services/company.service';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-agent-data-table',
  templateUrl: './company-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './company-data-table.component.scss',
  ],
})
export class CompanyDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  readonly companyRoutes = companyRoutes;

  hotelId: string;
  tableName = title;
  cols = cols;
  isQuickFilters = true;
  filterChips = chips;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    private router: Router,
    private companyService: CompanyService
  ) {
    super(fb, tabFilterService);
  }
  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTable();
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initTable();
  }

  // Mock Data for now
  initTable() {
    this.loading = true;
    // this.values = allOutletsResponse;

    this.companyService.getCompanyDetails(this.hotelId).subscribe(
      (res) => {
        // const companyList = new CompnayList().deserialize(res);
        this.values = res;
        // switch (this.selectedTable) {
        //   case TabValue.ALL:
        //     this.values = outletList.allOutlets;
        //     break;
        //   case TabValue.BANQUET:
        //     this.values = outletList.banquets;
        //     break;
        //   case TabValue.BAR:
        //     this.values = outletList.bar;
        //     break;
        //   case TabValue.CONFERENCE_ROOM:
        //     this.values = outletList.conferenceRoom;
        //     break;
        //   case TabValue.RESTAURANT:
        //     this.values = outletList.restaurant;
        //     break;
        // }
        this.updateTabFilterCount(res.entityTypeCounts, res.total);
        this.updateQuickReplyFilterCount(res.entityStateCounts);
        this.updateTotalRecords();
      },
      () => {
        this.values = [];
        this.loading = false;
      },
      this.handleFinal
    );
  }
  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status, rowData): void {
    // Not working
    this.loading = true;
    this.$subscription.add(
      this.companyService.updateOutletItem(rowData.id, status).subscribe(
        () => {
          this.updateStatusAndCount(rowData.status, status);

          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.handleError(error);
        },
        this.handleFinal
      )
    );
  }

  /**
   * @function editCompany To edit the company.
   * @params rowData
   */
  editCompany(rowData) {
    this.router.navigate([
      `/pages/members/company/${this.companyRoutes.editCompany.route}/${rowData.id}`,
    ]);
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
      this.companyService.exportCSV(this.hotelId).subscribe(
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
