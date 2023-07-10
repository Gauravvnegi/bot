import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
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
import { cols, tableName } from '../../constant/hotel-data-table';
import { BusinessService } from '../../services/business.service';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { QueryConfig } from '@hospitality-bot/admin/library';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { businessRoute } from '../../constant/routes';
import { HotelFormDataService } from '../../services/hotel-form.service';

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
  tableName = tableName;
  $subscription = new Subscription();
  entityId: string;
  hotelId: string;
  loading: boolean = false;
  globalQueries = [];
  tableFG;
  routerLink = businessRoute;
  @Input() parentId: string = '';

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private modalService: ModalService,
    private hotelFormDataService: HotelFormDataService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.initTableValue();
    this.hotelId = this.route.snapshot.params['entityId'];
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
        .getHotelList(this.parentId, this.getQueryConfig())
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
        ...this.getSelectedQuickReplyFiltersV2(),
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
      `Are you sure you want to Deactivate ${rowData?.name}`,
      ' Once deactivated, you will no longer be able to manage reservations, and the property or outlet website will become inaccessible to visitors.',
    ];
    let label: string = 'Deactivate';
    if (status) {
      description = [
        `Are you sure you want to Activate ${rowData?.name}`,
        ' Once Activated, you will be able to manage reservations, and the property or outlet website will be visible to visitors.',
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
        { parentId: this.parentId },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };

    this.$subscription.add(
      this.businessService.exportCSV(this.parentId, config).subscribe((res) => {
        this.loading = false;
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
      }, this.handelFinal)
    );
  }

  getSrc(value) {
    switch (value) {
      case '2':
        return 'assets/images/2.svg';
      case '3':
        return 'assets/images/3 star.svg';
      case '4':
        return 'assets/images/4 star.svg';
      case '5':
        return 'assets/images/5star.svg';
    }
  }

  editHotel(data) {
    if (data?.category === 'HOTEL') {
      this.router.navigate([`hotel/${data.id}`], {
        relativeTo: this.route,
      });
      this.hotelFormDataService.resetHotelInfoFormData();
    } else {
      this.router.navigate([`outlet/${data.id}`], {
        relativeTo: this.route,
      });
      this.hotelFormDataService.resetHotelInfoFormData();
    }
  }

  handelFinal = () => {
    this.loading = false;
  };
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
