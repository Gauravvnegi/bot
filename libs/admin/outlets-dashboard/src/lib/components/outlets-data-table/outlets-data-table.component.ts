import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { OutletTableService } from '../../services/outlet-table.service';
import * as FileSaver from 'file-saver';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  ReservationStatusDetails,
  posCols,
  reservationTypes,
} from '../../constants/data-table';
import {
  OutletReservationList,
  OutletReservation,
} from '../../models/outlet-reservation.model';
import { ReservationStatus } from '../../types/reservation-table';

@Component({
  selector: 'hospitality-bot-outlets-data-table',
  templateUrl: './outlets-data-table.component.html',
  styleUrls: [
    './outlets-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class OutletsDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  entityId: string;
  globalQueries = [];
  $subscription = new Subscription();
  reservationTypes = [reservationTypes.card, reservationTypes.table];
  selectedReservationType: string;
  outletTableData: OutletReservation[];

  readonly reservationStatusDetails = ReservationStatusDetails;

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected outletService: OutletTableService,
    private _clipboard: Clipboard,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.tableFG?.addControl('reservationType', new FormControl(''));
    this.setReservationType(this.reservationTypes[0].value);
    this.cols = posCols;
    this.initReservations();
  }

  setReservationType(value: string) {
    this.selectedReservationType = value;
    this.tableFG.patchValue({ reservationType: value });
  }

  loadData(event: LazyLoadEvent): void {
    // this.selectedReservationType === 'dinein' && this.initDineInReservation();
    // this.selectedReservationType === 'delivery' &&
    // this.initReservations();
  }

  initReservations() {
    this.$subscription.add(
      this.outletService.getReservations(this.entityId).subscribe((res) => {
        if (res) {
          const data = new OutletReservationList().deserialize(res);
          this.values = data.reservationData;
          this.outletTableData = data.reservationData;
          this.initFilters(
            res.entityTypeCounts,
            res.entityStateCounts,
            12,
            ReservationStatusDetails
          );
        }
      })
    );
  }

  exportCSV(): void {
    this.loading = true;

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        { order: 'DESC' },
        ...this.selectedRows.map((item) => ({ ids: item.id })),
      ]),
    };

    this.$subscription.add(
      this.outletService.exportCSV(this.entityId, config).subscribe((res) => {
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
      }, this.handleFinal)
    );
  }

  copyConfirmationNumber(number: string) {
    this._clipboard.copy(number);
    this.snackbarService.openSnackBarAsText('Booking number copied', '', {
      panelClass: 'success',
    });
  }

  handleStatus(status: ReservationStatus, reservationData: OutletReservation) {}

  handleMenuClick(value: string, rowData: OutletReservation) {}

  editReservation(id: string) {}

  addNewOrder() {}

  handleFinal = () => {
    this.loading = false;
  };
}
