import { Component, OnInit, ViewChild } from '@angular/core';
import { BaseChartDirective, Label, MultiDataSet } from 'ng2-charts';

@Component({
  selector: 'hospitality-bot-guest-documents-statistics',
  templateUrl: './guest-documents-statistics.component.html',
  styleUrls: ['./guest-documents-statistics.component.scss']
})
export class GuestDocumentsStatisticsComponent implements OnInit {

  @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

  chart: any = {
    Labels: ['Initiated', 'Pending', 'Accepted', 'Rejected'],
    Data: [
      [161, 60, 180, 84]
    ],
    Type: 'doughnut',
    Legend : false,
    Colors : [
      {
        backgroundColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
        borderColor: ['#FF8F00', '#38649F', '#389F99', '#EE1044'],
      }
    ],
    Options : {
      responsive: true,
      elements: {
        center: {
          text: '401',
          text3: "Total Users",
          fontColor: '#000',
          fontFamily: "CalibreWeb, 'Helvetica Neue', Arial ",
          fontSize: 36,
          fontStyle: 'normal'
        }
      },
      cutoutPercentage: 75
    },
  };
  constructor() { }

  ngOnInit(): void {
  }

}
