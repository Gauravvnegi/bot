import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { dashboard } from '../../../constants/dashboard';
import { tabFilterItems } from '../../../constants/tabFilterItem';
import { Arrivals } from '../../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../../modal/reservation-datatable-modal/reservation-datatable-modal.component';
import { openModal as openDynamicModal } from '@hospitality-bot/admin/shared';
import { DialogService } from 'primeng/dynamicdialog';
import { ReservationDialogData } from '../../../types/dashboard.type';

@Component({
  selector: 'hospitality-bot-arrivals-statistics',
  templateUrl: './arrivals-stats.component.html',
  styleUrls: ['./arrivals-stats.component.scss'],
})
export class ArrivalsStatisticsComponent implements OnInit, OnChanges {
  @Input() arrivals: Arrivals;

  progress = 0;
  constructor(public dialogService: DialogService) {}

  modalData = {
    tabFilterItems: tabFilterItems.arrivals,
    type: 'reservation',
  };

  ngOnChanges(): void {
    this.setProgress();
  }

  ngOnInit(): void {
    //  this.setProgress();
  }

  /**
   * @function setProgress To set the arrival progress.
   */
  setProgress() {
    if (this.arrivals?.maxExpected) {
      this.progress = Math.abs(
        (this.arrivals?.currentlyArrived / this.arrivals?.maxExpected) * 100
      );
    } else {
      this.progress = 0;
    }
  }

  /**
   * @function openModal To open the arrival reservation list as modal.
   */
  openModal(): void {
    // TODO: Need to remove
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.disableClose = true;
    // dialogConfig.width = '100%';
    // const detailCompRef = this._modalService.openDialog(
    //   ReservationDatatableModalComponent,
    //   dialogConfig
    // );

    // detailCompRef.componentInstance.tableName = dashboard.table.arrivals.name;
    // detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    // detailCompRef.componentInstance.tabFilterIdx = 0;
    // detailCompRef.componentInstance.onModalClose.subscribe((res) => {
    //   // remove loader for detail close
    //   detailCompRef.close();
    // });

    const data: ReservationDialogData = {
      tableName: dashboard.table.arrivals.name,
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
