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
import {
  deliveryReservationStatusDetails,
  reservationTypes,
} from '../../constants/data-table';
import {
  OutletReservationList,
  OutletReservation,
} from '../../models/outlet-reservation.model';

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
  reservationTypes = [reservationTypes.dineIn, reservationTypes.delivery];
  selectedReservationType: string;
  outletTableData: OutletReservation[];

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected outletService: OutletTableService,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.tableFG?.addControl('reservationType', new FormControl(''));
    this.setReservationType(this.reservationTypes[0].value);
  }

  setReservationType(value: string) {
    this.selectedReservationType = value;
    this.tableFG.patchValue({ reservationType: value });
    value === 'dinein' && this.initDineInReservation();
    value === 'delivery' && this.initDeliveryReservation();
  }

  loadData(event: LazyLoadEvent): void {
    // this.selectedReservationType === 'dinein' && this.initDineInReservation();
    // this.selectedReservationType === 'delivery' &&
    //   this.initDeliveryReservation();
  }

  initDeliveryReservation() {
    this.$subscription.add(
      this.outletService
        .getDeliveryReservations(this.entityId)
        .subscribe((res) => {
          if (res) {
            const data = new OutletReservationList().deserialize(res);
            this.values = data.reservationData;
            this.outletTableData = data.reservationData;
            this.initFilters(
              res.entityTypeCounts,
              res.entityStateCounts,
              12,
              deliveryReservationStatusDetails
            );
          }
        })
    );
  }

  initDineInReservation() {
    this.$subscription.add(
      this.outletService
        .getDineInReservations(this.entityId)
        .subscribe((res) => {
          if (res) {
            const data = new OutletReservationList().deserialize(res);
            this.values = data.reservationData;
            this.outletTableData = data.reservationData;
            this.initFilters(
              res.entityTypeCounts,
              res.entityStateCounts,
              12,
              deliveryReservationStatusDetails
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

  addNewOrder() {}

  handleFinal = () => {
    this.loading = false;
  };
}
