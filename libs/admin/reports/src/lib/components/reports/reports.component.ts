import { Component, OnInit } from '@angular/core';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';
import { ReportsService } from '../../services/reports.service';
import { ReportModules } from '../../types/reports.type';
import {
  ReportType,
  ReportsMenu,
  reportsConfig,
} from '../constant/reports.const';

@Component({
  selector: 'hospitality-bot-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  showMenu = false;
  reportTitle = 'Reservation';
  selectedReport: ReportType;
  reportsMenuOptions: ReportsMenu = [];
  selectedReportModule: ReportModules;

  columnData = ['Reservation No', 'Guest Name', 'Room Type'];
  rowData = [
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
    ['123', 'Ajay', 'Premium'],
  ];

  constructor(
    private reportsService: ReportsService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.initReportsMenuOptions();
    this.registerListener();
  }

  initReportsMenuOptions() {
    this.selectedReportModule = (this.routesConfigService
      .subModuleName as unknown) as ReportModules;

    this.reportsMenuOptions = reportsConfig[this.selectedReportModule]?.menu;
    this.selectedReport = this.reportsMenuOptions[0].value;
  }

  registerListener() {
    this.reportsService.showMenu.subscribe((res) => {
      this.showMenu = res;
    });
  }

  /**
   * To toggle selected report menu
   */
  toggleMenu() {
    this.reportsService.toggleMenu();
  }

  selectReport(value: ReportType) {
    this.selectedReport = value;
    this.toggleMenu();
  }
}
