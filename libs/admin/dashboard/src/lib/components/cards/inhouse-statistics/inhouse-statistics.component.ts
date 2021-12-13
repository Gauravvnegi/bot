import { Component, Input, OnChanges } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Inhouse, InhouseRequest } from '../../../data-models/statistics.model';
import { ReservationDatatableModalComponent } from '../../reservation-datatable-modal/reservation-datatable-modal.component';

@Component({
  selector: 'hospitality-bot-inhouse-statistics',
  templateUrl: './inhouse-statistics.component.html',
  styleUrls: ['./inhouse-statistics.component.scss'],
})
export class InhouseStatisticsComponent implements OnChanges {
  @Input() inhouse: Inhouse;
  @Input() inhouseRequest: InhouseRequest;

  chart: any = {
    Labels: ['No Data'],
    Data: [[100]],
    Type: 'doughnut',

    Legend: false,
    Colors: [
      {
        backgroundColor: ['#D5D1D1'],
        borderColor: ['#D5D1D1'],
      },
    ],
    Options: {
      tooltips: {
        backgroundColor: 'white',
        bodyFontColor: 'black',
        borderColor: '#f4f5f6',
        borderWidth: 3,
        titleFontColor: 'black',
        titleMarginBottom: 5,
        xPadding: 10,
        yPadding: 10,
      },
      responsive: true,
      elements: {
        center: {
          text: '401',
          text3: 'Total Users',
          fontColor: '#000',
          fontFamily: "CalibreWeb, 'Helvetica Neue', Arial ",
          fontSize: 36,
          fontStyle: 'normal',
        },
      },
      cutoutPercentage: 0,
    },
  };

  percentStyle: string = '--percentage : 80; --fill: hsla(266, 90%, 54%, 1) ;';

  modalData = {
    tabFilterItems: [
      {
        label: 'Inhouse',
        content: '',
        value: 'INHOUSE',
        disabled: false,
        total: 0,
        chips: [],
        lastPage: 0,
      },
    ],
    type: 'reservation',
  };

  constructor(private modalService: ModalService) {}

  ngOnChanges(): void {
    this.initGraphData();
  }

  private initGraphData(): void {
    this.chart.Data = [[]];
    this.chart.Data[0][0] = this.inhouse.kidsCount;
    this.chart.Data[0][1] = this.inhouse.adultCount;

    if (this.chart.Data[0].reduce((a, b) => a + b, 0)) {
      this.setChartOptions();
    } else {
      this.chart.Data = [[100]];
      this.chart.Colors = [
        {
          backgroundColor: ['#D5D1D1'],
          borderColor: ['#D5D1D1'],
        },
      ];
      this.chart.Labels = ['No data'];
    }
  }

  setChartOptions(): void {
    this.chart.Colors = [
      {
        backgroundColor: ['#4BA0F5', '#FFBF04'],
        borderColor: ['#4BA0F5', '#FFBF04'],
      },
    ];
    this.chart.Labels = ['Kid', 'Adult'];
  }

  openModal() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      ReservationDatatableModalComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.tableName = 'In-House';
    detailCompRef.componentInstance.tabFilterItems = this.modalData.tabFilterItems;
    detailCompRef.componentInstance.tabFilterIdx = 0;
    detailCompRef.componentInstance.onModalClose.subscribe((res) => {
      // remove loader for detail close
      detailCompRef.close();
    });
  }
}
