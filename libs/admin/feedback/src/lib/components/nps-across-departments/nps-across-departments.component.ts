import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { StatisticsService } from '../../services/statistics.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { NPSDepartments, Department } from '../../data-models/statistics.model';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'hospitality-bot-nps-across-departments',
  templateUrl: './nps-across-departments.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './nps-across-departments.component.scss',
  ],
})
export class NpsAcrossDepartmentsComponent implements OnInit {
  npsFG: FormGroup;
  documentTypes = [
    { label: 'CSV', value: 'csv' },
    // { label: 'EXCEL', value: 'excel' },
    // { label: 'PDF', value: 'pdf' },
  ];
  npsChartData: NPSDepartments;
  $subscription: Subscription = new Subscription();
  globalQueries = [];
  selectedInterval: string;
  loading: boolean = false;

  documentActionTypes = [
    {
      label: `Export`,
      value: 'export',
      type: 'countType',
      defaultLabel: 'Export',
    },
  ];

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
        this.getNPSChartData();
      })
    );
  }

  initFG(): void {
    this.npsFG = this.fb.group({
      documentType: ['csv'],
      documentActionType: ['Export All'],
    });
  }

  private getNPSChartData(): void {
    this.loading = true;
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(this.globalQueries),
    };
    this.$subscription.add(
      this._statisticService.getDepartmentsStatistics(config).subscribe(
        (response) => {
          this.npsChartData = new NPSDepartments().deserialize(
            response.npsStats
          );
          this.loading = false;
          console.log(this.npsChartData)
        },
        ({ error }) => {
          this.loading = false;
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
        },
      ]),
    };
    this.$subscription.add(
      this._statisticService.exportOverallDepartmentsCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            'NPS_Across_Departments_export_' + new Date().getTime() + '.csv'
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
}
