import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from '@hospitality-bot/shared/material';
import { dashboard } from '../../../constants/dashboard';
import { tabFilterItems } from '../../../constants/tabFilterItem';
import { Arrivals } from '../../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../../modal/reservation-datatable-modal/reservation-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-arrivals-statistics',
  templateUrl: './arrivals-stats.component.html',
  styleUrls: ['./arrivals-stats.component.scss'],
})
export class ArrivalsStatisticsComponent implements OnInit {
  @Input() arrivals: Arrivals;

  progress = 0;
  constructor(private _modalService: ModalService) {}

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
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modalService.openDialog(
      ReservationDatatableModalComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = dashboard.table.arrivals.name;
    detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      detailCompRef.close();
    });
  }

  get dashboardConfig() {
    return dashboard;
  }
}
