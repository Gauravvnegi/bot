import { Component, OnInit, Input } from '@angular/core';
import { dashboard } from '../../../constants/dashboard';
import { tabFilterItems } from '../../../constants/tabFilterItem';
import { Departures } from '../../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../../modal/reservation-datatable-modal/reservation-datatable-modal.component';
import { ReservationDialogData } from '../../../types/dashboard.type';
import { openModal as openDynamicModal } from '@hospitality-bot/admin/shared';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-departure-statistics',
  templateUrl: './departure-stats.component.html',
  styleUrls: ['./departure-stats.component.scss'],
})
export class DepartureStatisticsComponent implements OnInit {
  @Input() departures: Departures;
  modalData = {
    tabFilterItems: tabFilterItems.departure,
    type: 'reservation',
  };

  constructor(public dialogService: DialogService) {}

  ngOnInit(): void {}

  /**
   * @function openModal To open departure reservation list as modal.
   */
  openModal(): void {
    //Todo: Need to remove
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.width = '100%';
    // const detailCompRef = this._modalService.openDialog(
    //   ReservationDatatableModalComponent,
    //   dialogConfig
    // );

    // detailCompRef.componentInstance.tableName = dashboard.table.departures.name;
    // detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    // detailCompRef.componentInstance.tabFilterIdx = 0;
    // detailCompRef.componentInstance.onModalClose.subscribe((res) => {
    //   // remove loader for detail close
    //   detailCompRef.close();
    // });

    const data: ReservationDialogData = {
      tableName: dashboard.table.departures.name,
      tabFilterItems: this.modalData.tabFilterItems,
      tabFilterIdx: 0,
    };
    openDynamicModal({
      config: { data },
      component: ReservationDatatableModalComponent,
      dialogService: this.dialogService,
    });
  }

  get dashboardConfig() {
    return dashboard;
  }
}
