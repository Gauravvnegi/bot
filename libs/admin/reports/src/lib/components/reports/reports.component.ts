import { Component, OnInit } from '@angular/core';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ReportsService } from '../../services/reports.service';
import {
  ReportModules,
  ReportType,
  ReportsMenu,
} from '../../types/reports.type';
import { reportsConfig } from '../constant/reports.const';
import { convertToTitleCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

@Component({
  selector: 'hospitality-bot-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  showMenu = false;
  reportTitle = '';
  reportsMenuOptions: ReportsMenu = [];
  selectedReportModule: ReportModules;
  selectedReport: ReportsMenu[number];

  constructor(
    private reportsService: ReportsService,
    private routesConfigService: RoutesConfigService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListener();
    this.initReportConfigDetails();
  }

  registerListener() {
    this.reportsService.showMenu.subscribe((res) => {
      this.showMenu = res;
    });
    this.reportsService.$selectedReport.subscribe((report) => {
      if (report) {
        this.selectedReport = report;
      }
    });
  }

  initReportConfigDetails() {
    this.selectedReportModule = (this.routesConfigService
      .subModuleName as unknown) as ReportModules;
    this.settReportMainTitle();
    this.reportsMenuOptions = reportsConfig[this.selectedReportModule]?.menu;
    this.reportsService.$selectedReport.next(this.reportsMenuOptions[0]);
  }

  /**
   * To toggle selected report menu
   */
  toggleMenu() {
    this.reportsService.toggleMenu();
  }

  selectReport(value: ReportsMenu[number]) {
    if (value.value !== this.reportsService.$selectedReport.value.value) {
      this.reportsService.$selectedReport.next(value);
    }
    this.toggleMenu();
  }

  settReportMainTitle() {
    this.reportTitle = convertToTitleCase(this.selectedReportModule);
  }
}
