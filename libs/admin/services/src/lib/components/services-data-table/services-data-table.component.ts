import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  chips,
  cols,
  filters,
  TableValue,
  title,
} from '../../constant/data-table';
import { servicesRoutes } from '../../constant/routes';
import { ServiceList } from '../../models/services.model';
import { ServicesService } from '../../services/services.service';
import { ServiceListResponse, ServiceResponse } from '../../types/response';
import { ServiceData } from '../../types/service';

@Component({
  selector: 'hospitality-bot-services-data-table',
  templateUrl: './services-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './services-data-table.component.scss',
  ],
})
export class ServicesDataTableComponent extends BaseDatatableComponent {
  readonly servicesRoutes = servicesRoutes;

  hotelId: string;
  tabFilterItems = filters;
  selectedTable: TableValue;
  tableName = title;
  filterChips = chips;
  cols = cols;
  isQuickFilters = true;
  isAllATabItem = true;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private servicesService: ServicesService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService, // private router: Router, // private modalService: ModalService
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenToTableChange();
  }

  /**
   * @function listenToTableChange  To listen to table changes
   */
  listenToTableChange() {
    this.servicesService.selectedTable.subscribe((value) => {
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

  initTableValue() {
    this.loading = true;

    this.servicesService
      .getLibraryItems<ServiceListResponse>(this.hotelId, this.getQueryConfig())
      .subscribe(
        (res) => {
          const serviceList = new ServiceList().deserialize(res);
          switch (this.selectedTable) {
            case TableValue.ALL:
              this.values = serviceList.allService;
              break;
            case TableValue.PAID:
              this.values = serviceList.paidService;
              break;
            case TableValue.COMPLIMENTARY:
              this.values = serviceList.complimentaryService;
              break;
          }

          this.initFilters(
            serviceList.entityTypeCounts,
            serviceList.entityStateCounts,
            serviceList.total
          );
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
  handleStatus(status: boolean, rowData): void {
    this.loading = true;
    this.$subscription.add(
      this.servicesService
        .updateLibraryItem<Partial<ServiceData>, ServiceResponse>(
          this.hotelId,
          rowData.id,
          { active: status },
          { params: '?type=SERVICE' }
        )
        .subscribe(
          (res) => {
            this.initTableValue();
            this.snackbarService.openSnackBarAsText(
              'Status changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  /**
   * @function editService To Edit the service
   */
  editService(id: string) {
    this.router.navigate([
      `/pages/library/services/${servicesRoutes.createService.route}/${id}`,
    ]);
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFiltersV2(),
        {
          type: LibraryItem.service,
          serviceType: this.selectedTable,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        { type: LibraryItem.service },
      ]),
    };
    this.$subscription.add(
      this.servicesService.exportCSV(this.hotelId, config).subscribe(
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
