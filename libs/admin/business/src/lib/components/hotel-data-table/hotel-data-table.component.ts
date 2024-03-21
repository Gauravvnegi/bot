import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  openModal,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import {
  BrandTableName,
  HotelTableName,
  cols,
} from '../../constant/hotel-data-table';
import { BusinessService } from '../../services/business.service';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { QueryConfig } from '@hospitality-bot/admin/library';
import * as FileSaver from 'file-saver';
import { LazyLoadEvent } from 'primeng/api';
import { businessRoute } from '../../constant/routes';
import { HotelFormDataService } from '../../services/hotel-form.service';
import { EntityList } from '../../models/property.model';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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
  tableName = BrandTableName;
  $subscription = new Subscription();
  entityId: string;
  loading: boolean = false;
  globalQueries = [];
  tableFG;
  routerLink = businessRoute;
  @Input() parentId: string = '';

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute,
    private businessService: BusinessService,
    private hotelFormDataService: HotelFormDataService,
    private dialogService: DialogService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.initTableValue();
    this.entityId = this.route.snapshot.params['entityId'];
    this.tableName = this.entityId ? HotelTableName : BrandTableName;
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
        .getPropertyList(this.parentId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const data = new EntityList().deserialize(res);
            this.values = data.records;
            this.totalRecords = data.total;
          },
          ({ error }) => {
            this.values = [];
            this.loading = false;
          },
          this.handelFinal
        )
    );
  }

  secondsToAMPMTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const period = hours < 12 ? 'AM' : 'PM';

    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

    const timeString = `${formattedHours
      .toString()
      .padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${period}`;
    return timeString;
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
   * @function handleStatus
   * @description To handle status Active/Inactive
   */

  handleStatus(status: boolean, rowData): void {
    // let heading: string;
    let description: string[] = [
      `Are you sure you want to Deactivate ${rowData?.name}?`,
      ' Once deactivated, you will no longer be able to manage reservations, and the property or outlet',
      'website will become inaccessible to visitors.',
    ];
    let label: string = 'Deactivate';
    if (status) {
      description = [
        `Are you sure you want to Activate ${rowData?.name}?`,
        ' Once Activated, you will be able to manage reservations, and the property or outlet website will be visible to visitors.',
      ];
      label = 'Activate';
    }

    let dialogRef: DynamicDialogRef;
    const modalData: Partial<ModalComponent> = {
      heading: `Mark As ${status ? 'Active' : 'Inactive'}`,
      descriptions: description,
      actions: [
        {
          label: 'Cancel',
          onClick: () => dialogRef.close(),
          variant: 'outlined',
        },
        {
          label: label,
          onClick: () => {
            this.changeStatus(status, rowData);
            dialogRef.close();
          },
          variant: 'contained',
        },
      ],
    };
    dialogRef = openModal({
      config: { styleClass: 'confirm-dialog', width: 'unset', data: modalData },
      dialogService: this.dialogService,
      component: ModalComponent,
    });
  }

  changeStatus(status: boolean, rowData): void {
    this.loading = true;
    this.$subscription.add(
      this.businessService
        .updateHotel(rowData.id, { status: status ? 'ACTIVE' : 'INACTIVE' })
        .subscribe(
          (res) => {
            this.initTableValue();
            this.snackbarService.openSnackBarAsText(
              'Status changed successfully',
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
