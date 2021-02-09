import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NPSAcrossServices } from '../../data-models/statistics.model';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-nps-across-services',
  templateUrl: './nps-across-services.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-services.component.scss',
  ],
})
export class NpsAcrossServicesComponent implements OnInit {

  options = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      mode: 'label',
      callbacks: {
        label: function(tooltipItem, data) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
  
          if (tooltipItem.index == 0 && tooltipItem.datasetIndex !== 0)
            return null;
  
          return dataset.label + ': ' + Number(dataset.data[tooltipItem.index]);
        }
      }
    },
    scales: {
      xAxes: [{
        display: true,
        gridLines: {
          display: true
        },
        labels: {
          show: true
        }
      }],
      yAxes: [{
        type: "linear",
        display: true,
        position: "left",
        id: "y-axis-1",
        gridLines: {
          display: false
        },
        labels: {
          show: false
        }
      }, {
        type: "linear",
        display: true,
        gridLines: {
          display: true
        },
        labels: {
          show: true
        },
        ticks: {
          beginAtZero: false,
          userCallback: function(value) {
            return Number(value);
          }
        }
      }, {
        type: "linear",
        display: false,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }, {
        type: "linear",
        display: false,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }, {
        type: "linear",
        display: false,
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }, {
        type: "linear",
        display: false,
        id: "y-axis-5",
        gridLines: {
          display: false
        },
        labels: {
          show: true
        }
      }]
    },
    legend: {
      labels: {
        fontSize: 11,
        usePointStyle: true,
        padding: 15,
        filter: (legendItem, chartData) => {
          if (legendItem.datasetIndex > 0) return true;
        }
      }
    }
  };
  data = {
    labels: ["Opening Balance", "Qtr-1", "Qtr-2", "Qtr-3", "Qtr-4"],
    datasets: [{
      type: 'bar',
      label: "Opening Balance",
      data: [1120000],
      fill: true,
      backgroundColor: 'rgba(243, 194, 0, .3)',
      borderWidth: 1,
      borderColor: '#F3C200',
      hoverBackgroundColor: '#F3C200',
      hoverBorderColor: '#7d6505',
      stack: 'OB'
    }, {
      type: 'bar',
      label: "Income",
      data: [,210000,258900,475669,402569],
      fill: true,
      backgroundColor: 'rgba(42, 180, 192, .3)',
      borderWidth: 1,
      borderColor: '#166269',
      hoverBackgroundColor: '#2ab4c0',
      hoverBorderColor: '#2ab4c0',
      stack: 'Income'
    }, {
      type: 'bar',
      label: "Income Expected",
      data: [,215000,320000,412236,385569],
      fill: true,
      backgroundColor: 'rgba(76, 135, 185, .4)',
      borderWidth: 1,
      borderColor: '#2a587f',
      hoverBackgroundColor: '#4c87b9',
      hoverBorderColor: '#2a587f',
      stack: 'Income'
    }, {
      type: 'bar',
      label: "Expenditures",
      data: [,204560,256987,236981,365587],
      fill: true,
      backgroundColor: 'rgba(243, 82, 58, .3)',
      borderWidth: 1,
      borderColor: '#f3523a',
      hoverBackgroundColor: '#f56954',
      hoverBorderColor: '#f3523a',
      stack: 'Expenditures'
    }, {
      type: 'bar',
      label: "Expenditures Expected",
      data: [,269877,325698, 435887, 423369],
      fill: true,
      backgroundColor: 'rgba(228, 58, 69, .4)',
      borderWidth: 1,
      borderColor: '#b32a33',
      hoverBackgroundColor: '#e43a45',
      hoverBorderColor: '#b32a33',
      stack: 'Expenditures'
    }, {
      label: "Balance",
      type: 'bar',
      data: [,54400,19013,14569,24998],
      fill: true,
      borderColor: '#1ebfae',
      backgroundColor: 'rgba(30, 191, 174, .3)',
      borderWidth: 1,
      hoverBackgroundColor: '#1ebfae',
      hoverBorderColor: '#099486',
      stack: 'Balance'
    }]
  };
  

  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];
  $subscription: Subscription = new Subscription();
  selectedInterval: string;
  npsProgressData: NPSAcrossServices;
  dividerHeight: number = 0;

  tabFilterIdx: number = 0;

  tabFilterItems = [];

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

  isOpened = false;
  globalQueries = [];
  progresses: any = [];

  progressValues = [-100, -80, -60, -40, -20, 0, 20, 40, 60, 80, 100];

  constructor(
    private fb: FormBuilder,
    private _adminUtilityService: AdminUtilityService,
    private _statisticService: StatisticsService,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  registerListeners() {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        let calenderType = {
          calenderType: this._adminUtilityService.getCalendarType(
            data['dateRange'].queryValue[0].toDate,
            data['dateRange'].queryValue[1].fromDate
          ),
        };
        this.selectedInterval = calenderType.calenderType;
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
          calenderType,
        ];
        this.getNPSServices();
      })
    );
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['exportAll'],
      quickReplyActionFilters: [[]],
    });
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    this.getNPSServices();
  }

  isQuickReplyFilterSelected(quickReplyFilter) {
    // const index = this.quickReplyTypes.indexOf(offer);
    // return index >= 0;
    return true;
  }

  toggleQuickReplyFilter(quickReplyTypeIdx, quickReplyType) {
    //toggle isSelected
    this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
      quickReplyTypeIdx
    ].isSelected;
    this.updateQuickReplyActionFilters();
  }

  updateQuickReplyActionFilters(): void {
    console.log(this.tabFilterItems);
    let value = [];
    this.tabFilterItems[this.tabFilterIdx].chips
      .filter((chip) => chip.isSelected)
      .forEach((d) => {
        value.push(d.value);
      });
    this.quickReplyActionFilters.patchValue(value);
    this.getNPSServices();
  }

  private initTabLabels(entities, departments): void {
    if (!this.tabFilterItems.length) {
      if (!this.tabFilterItems.length) {
        departments.forEach((data) =>
          this.tabFilterItems.push({
            label: data.value,
            content: '',
            value: data.key,
            disabled: false,
            total: 0,
            chips: entities[data.key],
          })
        );
      }
    }
  }

  private initProgressData(progresses) {
    this.progresses.length = 0;
    this.dividerHeight = 0;
    Object.keys(progresses).forEach((key) => {
      let mod = Math.floor(progresses[key].label.length / 20);
      this.dividerHeight += 40 + mod * 13;
      this.progresses.push({
        label: progresses[key].label,
        positive:
          progresses[key].score < 0
            ? 100 + progresses[key].score
            : progresses[key].score,
        negative: progresses[key].score
          ? progresses[key].score < 0
            ? progresses[key].score * -1
            : Number((100 - progresses[key].score).toFixed(2))
          : progresses[key].score,
      });
    });
  }

  getSelectedQuickReplyFilters() {
    return this.tabFilterItems.length
      ? this.tabFilterItems[this.tabFilterIdx].chips
          .filter((item) => item.isSelected == true)
          .map((item) => ({
            services: item.value,
          }))
      : '';
  }

  private getNPSServices(): void {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          departments: this.tabFilterItems.length
            ? this.tabFilterItems[this.tabFilterIdx].value
            : 'ALL',
        },
        ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.getServicesStatistics(config).subscribe(
        (response) => {
          this.npsProgressData = new NPSAcrossServices().deserialize(response);
          if (this.npsProgressData.entities) {
            this.initTabLabels(
              this.npsProgressData.entities,
              this.npsProgressData.departments
            );
          }
          this.initProgressData(this.npsProgressData.npsStats);
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  exportCSV() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        // ...this.getSelectedQuickReplyFilters(),
      ]),
    };
    this.$subscription.add(
      this._statisticService.exportOverallServicesCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPS_Across_Services_export_' + new Date().getTime() + '.csv'
          );
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  get quickReplyActionFilters(): FormControl {
    return this.npsFG.get('quickReplyActionFilters') as FormControl;
  }
}
