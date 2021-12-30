import { Component, OnInit, Input } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from '@hospitality-bot/shared/material';
import { dashboard } from '../../../constants/dashboard';
import { tabFilterItems } from '../../../constants/tabFilterItem';
import { Departures } from '../../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../../modal/reservation-datatable-modal/reservation-datatable-modal.component';

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

  constructor(private _modalService: ModalService) {}

  ngOnInit(): void {}

  /**
   * @function openModal To open departure reservation list as modal.
   */
  openModal(): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this._modalService.openDialog(
      ReservationDatatableModalComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = dashboard.table.departures.name;
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
