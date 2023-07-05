import { Component, OnInit } from '@angular/core';
import { companyRoutes } from '../../constants/route';
import { cols, title } from '../../constants/datatable';
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
import { SnackBarService } from '@hospitality-bot/shared/material';
import { LazyLoadEvent } from 'primeng/api';
import { CompanyResponseModel } from '../../models/company.model';
import { CompanyListResponse } from '../../types/response';

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
  tableName = title;
  cols = cols;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
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

  ngOnInit(): void {
    this.initTable();
  }

  initTable() {
    this.loading = true;
    this.companyService.getCompanyDetails(this.getQueryConfig()).subscribe(
      (res: CompanyListResponse) => {
        const companyList = new CompanyResponseModel().desearalize(res);
        this.values = companyList.records;
        this.initFilters(
          companyList.entityTypeCounts,
          companyList.entityStateCounts,
          companyList.totalRecord
        );
        this.loading = false;
      },
      () => {
        this.values = [];
        this.loading = false;
      },
      this.handleFinal
    );
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFiltersV2({ isStatusBoolean: true }),
        {
          type: 'COMPANY',
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * @function handleStatus To handle the status change
   * @param status status value
   */
  handleStatus(status, rowData): void {
    this.loading = true;
    this.$subscription.add(
      this.companyService
        .updateCompanyStatus(rowData.id, {
          params: `?status=${status}&type=COMPANY`,
        })
        .subscribe(
          () => {
            this.initTable();
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

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };
    this.$subscription.add(
      this.companyService.exportCSV(config).subscribe(
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
