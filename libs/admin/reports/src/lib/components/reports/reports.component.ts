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
} from '../../types/reports.types';
import { reportsConfig } from '../../constant/reports.const';
import {
  camelToKebab,
  kebabToCamel,
  convertToTitleCase,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import { NavRouteOption, NavRouteOptions } from '@hospitality-bot/admin/shared';
import { ActivatedRoute, Router } from '@angular/router';

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
  navRoutes: NavRouteOptions = [];

  constructor(
    private reportsService: ReportsService,
    private routesConfigService: RoutesConfigService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    let reportName = this.route.snapshot.params['report'] as ReportType;
    reportName = reportName && kebabToCamel(reportName);
    this.initReportConfigDetails(); //we are getting the report menu options from the config file

    //if there is no report selected, then select the first report from the list and navigate to that report
    !reportName &&
      this.router.navigate(
        [`${camelToKebab(this.reportsMenuOptions[0].value)}`],
        {
          relativeTo: this.route,
          replaceUrl: true,
        }
      );

    this.selectedReport = (this.reportsMenuOptions as any[]).find(
      (report) => (report.value as ReportType) === reportName
    );

    //after emitting the selected report to get the corresponding data
    this.reportsService.$selectedReport.next(this.selectedReport);

    this.registerListener();
    this.initNavRoutes();
  }

  registerListener() {
    this.reportsService.showMenu.subscribe((res) => {
      this.showMenu = res;
    });
    if (this.selectedReport) {
      this.selectedReport = this.selectedReport;
      this.navRoutes.pop();
      this.navRoutes = [
        ...this.navRoutes,
        {
          label: this.selectedReport?.label,
          link: './',
        } as NavRouteOption,
      ];
    }
  }

  initReportConfigDetails() {
    this.selectedReportModule = (this.routesConfigService
      .subModuleName as unknown) as ReportModules;

    this.settReportMainTitle();
    this.reportsMenuOptions =
      reportsConfig[this.selectedReportModule]?.menu ?? [];

    // this.reportsService.$selectedReport.next(this.reportsMenuOptions[0]);
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = navRoutesRes;
      this.navRoutes = [
        ...this.navRoutes,
        {
          label: this.selectedReport.label,
          link: './',
        } as NavRouteOption,
      ];
    });
  }

  /**
   * To toggle selected report menu
   */
  toggleMenu() {
    this.reportsService.toggleMenu();
  }

  selectReport(value: ReportsMenu[number]) {
    if (value.value !== this.reportsService.$selectedReport.value.value) {
      //navigate to the selected report
      this.router.navigate([`../${camelToKebab(value.value)}`], {
        relativeTo: this.route,
      });
      this.selectedReport = value;
      this.reportsService.$selectedReport.next(value);
    }
    this.toggleMenu();
  }

  settReportMainTitle() {
    this.reportTitle = convertToTitleCase(this.selectedReportModule);
  }

  handleNavClick(num: number) {
    if (num === 3) {
      this.toggleMenu();
    }
  }
}
