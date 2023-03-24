import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { RoomService } from '../../services/room.service';
import { Chart } from 'chart.js';
import { NavRouteOptions } from 'libs/admin/shared/src';

@Component({
  selector: 'hospitality-bot-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss'],
})
export class RoomComponent implements OnInit, AfterViewInit {
  constructor(
    private globalFilterService: GlobalFilterService,
    private roomService: RoomService
  ) {}

  statsArr: any[] = [
    {
      label: 'AverageRoomRate',
      score: 12,
      comparisonPercent: 10,
      additionalData: '2.01K',
    },
    {
      label: 'Occupancy',
      score: 20,
      comparisonPercent: 10,
      additionalData: '59%',
    },
    {
      label: 'InventoryRemaining',
      score: 100,
      additionalData: '3 Rooms',
    },
    {
      label: 'RemainingInventoryCost',
      score: 34,
      additionalData: '200K',
    },
  ];

  hotelId: string;
  $subscription = new Subscription();
  chart: any;
  @ViewChild('myChart') myChart: ElementRef;

  ngAfterViewInit(): void {
    this.setOccupancyChartConfig();
    this.setAvgRoomRateChartConfig();
  }

  ngOnInit(): void {
    this.listenForGlobalFilter();
    this.setDoughnutChartConfig(
      'remaining-inventory-cost',
      [300, 50],
      ['Spent', 'Remaining']
    );
    this.setDoughnutChartConfig(
      'remaining-inventory',
      [3000, 500],
      ['Occupied', 'Remaining']
    );
  }

  listenForGlobalFilter(): void {
    this.hotelId = this.globalFilterService.hotelId;

    this.$subscription.add(
      this.roomService.getStats(this.hotelId).subscribe((res) => {
        // currently using dummy data
        Object.entries(res).map(([key, value]) => {
          this.statsArr.push(value);
        });
      })
    );
  }

  setDoughnutChartConfig(id: string, dataValue: number[], labels: string[]) {
    this.chart = new Chart(id, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: dataValue,
            backgroundColor: ['#FF6283', '#FFCD56'],
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          display: true,
          position: 'right',
        },
      },
    });
  }

  setOccupancyChartConfig() {
    const canvas = this.myChart.nativeElement;
    const ctx = canvas.getContext('2d');

    this.chart = new Chart(ctx, {
      type: 'line',

      data: {
        datasets: [
          {
            label: 'Occupancy',
            backgroundColor: '#AAE8D1',
            borderColor: '#5FD1A7',
            fill: true,
            data: [
              { x: 0, y: 0 },
              { x: 500, y: 400 },
              { x: 1000, y: 1000 },
              { x: 1500, y: 800 },
              { x: 2500, y: 1800 },
              { x: 3500, y: 2000 },
            ],
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [
            {
              type: 'linear',
              position: 'bottom',
            },
          ],
          yAxes: [
            {
              type: 'linear',
            },
          ],
        },
      },
    });
  }

  setAvgRoomRateChartConfig() {
    this.chart = new Chart('average-room-rate', {
      type: 'bar',
      data: {
        labels: ['1 May', '8 May', '10 May'],
        datasets: [
          {
            label: 'Average Room Rate',
            data: [10, 100, 3],
            backgroundColor: '#8064FA',
            borderColor: 'rgba(54, 162, 235, 1)',
            hoverBorderColor: 'red',
            borderWidth: 0,
            barThickness: 6,
          },
        ],
      },
      options: {
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
              },
            },
          ],
        },
      },
    });
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
