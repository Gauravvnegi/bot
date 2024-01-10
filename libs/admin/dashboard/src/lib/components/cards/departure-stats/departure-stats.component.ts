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
    const data: ReservationDialogData = {
      tableName: dashboard.table.departures.name,
      tabFilterItems: this.modalData.tabFilterItems,
      tabFilterIdx: 0,
    };
    openDynamicModal({
      config: { width: '80%', data },
      component: ReservationDatatableModalComponent,
      dialogService: this.dialogService,
    });
  }

  get dashboardConfig() {
    return dashboard;
  }
}
