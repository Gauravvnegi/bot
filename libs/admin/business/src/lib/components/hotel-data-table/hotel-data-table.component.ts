import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { cols } from '../../constant/hotel-data-table';
import { BusinessService } from '../../services/business.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { QueryConfig } from '@hospitality-bot/admin/library';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-hotel-data-table',
  templateUrl: './hotel-data-table.component.html',
  styleUrls: [
    './../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './hotel-data-table.component.scss',
  ],
})
export class HotelDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  cols = cols;
  tableName = 'Property/Outlet';
  $subscription = new Subscription();
  hotelId: string;
  loading: boolean = false;
  globalQueries = [];
  tableFG;
  @Input() brandId: string = '';

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
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
    this.$subscription.add(
      this.businessService
        .getHotelList(this.brandId, this.getQueryConfig())
        .subscribe(
          (res) => {
            this.values = res.records;
            this.totalRecords = res.total;
          },
          ({ error }) => {
            this.values = [];
            this.loading = false;
          },
          this.handelFinal
        )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig() {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };

    return config;
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
        ? { entityState: null }
        : { entityState: chips[0].value === 'ACTIVE' },
    ];
  }

  /**
   * @function handleStatus
   * @description To handle status Active/Inactive
   */

  handleStatus(status: boolean, rowData): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );

    // let heading: string;
    let description: string[] = [
      `Are you sure you want to Deactive ${rowData?.name}`,
      ' Once Deactivated, you wont be to manage reservations and the hotel website will not be visible to visitors.',
    ];
    let label: string = 'Deactivate';
    if (status) {
      description = [
        `Are you sure you want to Activate ${rowData?.name}`,
        ' Once Activated, you will be able to manage reservations and the hotel website will be visible to visitors.',
      ];
      label = 'Activate';
    }

    togglePopupCompRef.componentInstance.content = {
      heading: `Mark As ${status ? 'Active' : 'Inactive'}`,
      description: description,
    };

    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'Cancel',
        onClick: () => this.modalService.close(),
        variant: 'outlined',
      },
      {
        label: label,
        onClick: () => {
          this.changeStatus(status, rowData);
          this.modalService.close();
        },
        variant: 'contained',
      },
    ];

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  changeStatus(status: boolean, rowData): void {
    this.loading = true;
    this.$subscription.add(
      this.businessService
        .updateHotel(rowData.id, { status: status })
        .subscribe(
          (res) => {
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
          ({ error }) => {},
          this.handelFinal
        )
    );
  }

  /**
   * @function exportCSV
   * @description To export the data
   */
  exportCSV(): void {
    this.loading = true;

    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { type: 'HOTEL' },
        { parentId: this.brandId },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };

    this.$subscription.add(
      this.businessService.exportCSV(this.brandId, config).subscribe((res) => {
        this.loading = false;
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
      }, this.handelFinal)
    );
  }

  editHotel(Id) {
    this.router.navigate([
      `pages/settings/business-info/brand/${this.brandId}/hotel/${Id}`,
    ]);
  }

  handelFinal = () => {
    this.loading = false;
  };
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
