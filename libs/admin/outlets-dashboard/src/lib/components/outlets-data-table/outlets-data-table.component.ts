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
  Option,
  QueryConfig,
  manageMaskZIndex,
  openModal,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { OutletTableService } from '../../services/outlet-table.service';
import * as FileSaver from 'file-saver';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  OrderReservationStatusDetails,
  OrderTableType,
  TableReservationStatusDetails,
  posCols,
  reservationTypes,
} from '../../constants/data-table';
import {
  OutletReservationList,
  OutletReservation,
  OutletReservationTableList,
} from '../../models/outlet-reservation.model';
import { OrderReservationStatus } from '../../types/reservation-table';
import { PosReservationComponent } from '../pos-reservation/pos-reservation.component';
import { OutletFormService } from '../../services/outlet-form.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { takeUntil } from 'rxjs/operators';

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
  reservationTypes = [];
  selectedReservationType: string;
  outletTableData: OutletReservation[];

  sidebarVisible = false;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  selectedTab: OrderTableType;

  readonly reservationStatusDetails = OrderReservationStatusDetails;
  private cancelRequests$ = new Subject<void>();

  constructor(
    public fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected outletService: OutletTableService,
    private _clipboard: Clipboard,
    protected adminUtilityService: AdminUtilityService,
    protected snackbarService: SnackBarService,
    private resolver: ComponentFactoryResolver,
    private formService: OutletFormService,
    private dialogService: DialogService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.initDetails();
  }

  initDetails() {
    this.entityId = this.formService.entityId;
    this.tableFG?.addControl('reservationType', new FormControl(''));

    this.reservationTypes = [reservationTypes.card, reservationTypes.table];
    this.setReservationType(this.reservationTypes[0].value);
    this.selectedTab = OrderTableType.ALL;
    this.isAllTabFilterRequired = true;

    this.tableFG.patchValue({ reservationType: this.selectedReservationType });
    this.cols = posCols;
    this.listenForGlobalFilterChanges();
  }

  setReservationType(value: string) {
    this.tabFilterItems = [];
    this.tabFilterIdx = 0;
    this.resetTableValues();
    this.selectedReservationType = value;
    this.tableFG.patchValue({ reservationType: value });
    this.loadData();
  }

  loadData(event?: LazyLoadEvent): void {
    this.cancelRequests$.next();
    this.selectedReservationType === 'table' && this.initTableReservations();
    this.selectedReservationType === 'card' && this.initCardViewList();
  }

  initCardViewList(): void {
    this.loading = true;

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        {
          order: 'DESC',
          type: 'TABLE',
          limit: '0',
          offset: '0',
          entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
          liveBookings: true,
        },
      ]),
    };

    this.subscriptionList$.add(
      this.outletService
        .getLiveTableList(this.entityId, config)
        .pipe(takeUntil(this.cancelRequests$))
        .subscribe(
          (response) => {
            const data = new OutletReservationList().deserialize(response);

            this.values = data?.reservationData;
            this.initFilters(
              data?.entityTypeCounts,
              data?.entityStateCounts,
              data?.total,
              TableReservationStatusDetails
            );
          },
          ({ error }) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  listenForGlobalFilterChanges(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((value) => {
        this.globalQueries = [
          ...value['filter'].queryValue,
          ...value['dateRange'].queryValue,
        ];
        this.loadData();
      })
    );
  }

  /**
   * @function getQueryConfig to configuration
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
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
        .pipe(takeUntil(this.cancelRequests$))
        .subscribe((res) => {
          const data = new OutletReservationTableList().deserialize(res);
          this.values = data.reservationData;

          this.initFilters(
            data?.entityTypeCounts,
            data?.entityStateCounts,
            data.total,
            this.reservationStatusDetails
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

  handleStatus(
    status: OrderReservationStatus,
    reservationData: OutletReservation
  ) {
    let modalRef: DynamicDialogRef;

    const data = {
      content: {
        heading: `Mark Order As ${
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
        }`,
        descriptions: [
          `You are about to mark this order as ${status}`,
          `Are you Sure?`,
        ],
      },
      actions: [
        {
          label: 'No',
          onClick: () => {
            modalRef.close();
          },
          variant: 'outlined',
        },
        {
          label: 'Yes',
          type: 'SUCCESS',
          onClick: () => {
            this.changeStatus(status, reservationData);
            modalRef.close();
          },
          variant: 'contained',
        },
      ],
    };

    modalRef = openModal({
      config: {
        width: '35vw',
        styleClass: 'confirm-dialog',
        data: data,
      },
      component: ModalComponent,
      dialogService: this.dialogService,
    });
  }

  changeStatus(
    status: OrderReservationStatus,
    reservationData: OutletReservation
  ) {
    this.loading = true;
    this.$subscription.add(
      this.outletService
        .updateOrderStatus(this.entityId, reservationData.orderId, {
          status: status,
        })
        .subscribe(
          (res) => {
            this.values.find(
              (item) => item.id === reservationData.id
            ).reservationType = status;
            this.initTableReservations();
            this.snackbarService.openSnackBarAsText(
              'Order ' + status + ' changes successfully',
              '',
              { panelClass: 'success' }
            );
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  editOrder(orderId: string) {
    this.addNewOrder(orderId);
  }

  onCardClick(data: {
    orderId?: string;
    reservationId?: string;
    selectedTable?: Option;
  }) {
    this.addNewOrder(data.orderId, data.reservationId, data.selectedTable);
  }

  addNewOrder(
    orderId?: string,
    reservationId?: string,
    selectedTable?: Option
  ) {
    this.sidebarVisible = true;
    const factory = this.resolver.resolveComponentFactory(
      PosReservationComponent
    );
    const sidebarData = {
      isSidebar: true,
      orderId: orderId,
      reservationId: reservationId,
      selectedTable: selectedTable,
    };
    this.sidebarSlide.clear();
    const componentRef = this.sidebarSlide.createComponent(factory);
    Object.assign(componentRef.instance, sidebarData);
    this.$subscription.add(
      componentRef.instance.onCloseSidebar.subscribe((res: boolean) => {
        this.sidebarVisible = false;
        if (res) this.initDetails();
      })
    );
    manageMaskZIndex();
  }

  /**
   * @function handleError to show the error
   * @param param network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
