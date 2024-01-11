import { Component, Input, OnChanges } from '@angular/core';
import {
  CircularChart,
  openModal as openDynamicModal,
} from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { chartConfig } from '../../../constants/chart';
import { dashboard } from '../../../constants/dashboard';
import { tabFilterItems } from '../../../constants/tabFilterItem';
import { Inhouse, InhouseRequest } from '../../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../../modal/reservation-datatable-modal/reservation-datatable-modal.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-inhouse-statistics',
  templateUrl: './inhouse-stats.component.html',
  styleUrls: ['./inhouse-stats.component.scss'],
})
export class InhouseStatisticsComponent implements OnChanges {
  @Input() inhouse: Inhouse;
  @Input() inhouseRequest: InhouseRequest;

  chart: CircularChart = {
    labels: ['No Data'],
    data: [[100]],
    type: chartConfig.types.doughnut,
    legend: false,
    colors: chartConfig.default.colors,
    options: dashboard.chart.option.inhouse,
  };

  modalData = {
    tabFilterItems: tabFilterItems.inhouse,
    type: 'reservation',
  };

  constructor(
    private _translateService: TranslateService,
    private dialogService: DialogService
  ) {}

  ngOnChanges(): void {
    this.initGraphData();
  }

  /**
   * @function initGraphData To initialize the graph data.
   */
  private initGraphData(): void {
    this.chart.data = [[]];
    this.chart.data[0][0] = this.inhouse?.kidsCount;
    this.chart.data[0][1] = this.inhouse?.adultCount;

    if (this.chart.data[0].reduce((acc, curr) => acc + curr, 0)) {
      this.setChartOptions();
    } else {
      this.chart.data = [[100]];
      this.chart.colors = chartConfig.default.colors;
      this._translateService
        .get('graph_no_data')
        .subscribe((message) => (this.chart.labels = [message]));
    }
  }

  /**
   * @function setChartOptions Sets the chart options for the graph.
   */
  setChartOptions(): void {
    this.chart.colors = dashboard.chart.color.inhouse;
    this.chart.labels = dashboard.chart.labels.inhouse;
  }

  /**
   * @function openModal To open the reservation list for inhouse bookings.
   */
  openModal(): void {
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<ReservationDatatableModalComponent> = {
      tableName: dashboard.table.inhouse.name,
      tabFilterItems: this.modalData.tabFilterItems,
      tabFilterIdx: 0,
    };
    dialogRef = openDynamicModal({
      config: {
        width: '80%',
        styleClass: 'confirm-dialog',
        data: modalData,
      },
      component: ReservationDatatableModalComponent,
      dialogService: this.dialogService,
    });
  }

  get dashboardConfig() {
    return dashboard;
  }
}
