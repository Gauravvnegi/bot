import {
  Component,
  ComponentFactoryResolver,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  QueryConfig,
  manageMaskZIndex,
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
  OutletReservationTableList,
} from '../../models/outlet-reservation.model';
import { ReservationStatus } from '../../types/reservation-table';
import { PosReservationComponent } from '../pos-reservation/pos-reservation.component';
import { OutletFormService } from '../../services/outlet-form.service';

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

  sidebarVisible = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  readonly reservationStatusDetails = ReservationStatusDetails;

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected outletService: OutletTableService,
    private _clipboard: Clipboard,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    private resolver: ComponentFactoryResolver,
    private formService: OutletFormService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.entityId = this.formService.entityId;
    this.tableFG?.addControl('reservationType', new FormControl(''));
    this.setReservationType(this.reservationTypes[0].value);
    this.cols = posCols;
  }

  setReservationType(value: string) {
    this.selectedReservationType = value;
    this.tableFG.patchValue({ reservationType: value });
    this.selectedReservationType === 'table' && this.initTableReservations();
    this.selectedReservationType === 'card' && this.initReservations();
  }

  loadData(event: LazyLoadEvent): void {
    this.selectedReservationType === 'table' && this.initTableReservations();
    this.selectedReservationType === 'card' && this.initReservations();
  }

  initReservations() {
    this.loading = true;
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
          this.loading = false;
        }
      })
    );
  }

  /**
   * @function getQueryConfig to configuration
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          order: 'DESC',
          includeKot: true,
          raw: true,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  initTableReservations() {
    this.loading = true;
    this.$subscription.add(
      this.outletService
        .getTableReservations(this.entityId, this.getQueryConfig())
        .subscribe((res) => {
          const data = new OutletReservationTableList().deserialize(res);
          this.values = data.reservationData;
          this.initFilters(
            data?.entityTypeCounts,
            {},
            12,
            ReservationStatusDetails
          );
          this.loading = false;
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

  editReservation(id: string) {
    this.addNewOrder(id);
  }

  addNewOrder(id?: string) {
    this.sidebarVisible = true;
    const factory = this.resolver.resolveComponentFactory(
      PosReservationComponent
    );
    const sidebarData = {
      isSidebar: true,
      orderId: id,
    };
    this.sidebarSlide.clear();
    const componentRef = this.sidebarSlide.createComponent(factory);
    Object.assign(componentRef.instance, sidebarData);
    this.$subscription.add(
      componentRef.instance.onCloseSidebar.subscribe((res) => {
        this.sidebarVisible = false;
      })
    );
    manageMaskZIndex();
  }

  handleFinal = () => {
    this.loading = false;
  };
}
