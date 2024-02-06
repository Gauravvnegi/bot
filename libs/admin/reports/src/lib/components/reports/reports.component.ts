import { Component, OnInit } from '@angular/core';
import {
  GlobalFilterService,
  RoutesConfigService,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';
import { ReportsService } from '../../services/reports.service';
import {
  ReportModules,
  ReportType,
  ReportsMenu,
} from '../../types/reports.types';
import {
  camelToKebab,
  kebabToCamel,
  convertToTitleCase,
} from 'libs/admin/shared/src/lib/utils/valueFormatter';
import {
  ModuleNames,
  NavRouteOption,
  NavRouteOptions,
  ProductNames,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductReportConfig, ReportConfig } from '../../models/report.models';
import { switchMap } from 'rxjs/operators';
import { Subscription, of } from 'rxjs';
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
  reportConfig: ProductReportConfig;
  selectedProduct: keyof typeof ProductNames;
  isLoading: boolean = false;
  subscription$ = new Subscription();

  constructor(
    private reportsService: ReportsService,
    private routesConfigService: RoutesConfigService,
    private router: Router,
    private route: ActivatedRoute,
    private subscriptionPlanService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.getReportConfig();
  }

  getReportConfig() {
    this.reportConfig = new ReportConfig().deserialize(
      this.subscriptionPlanService.getReportConfig()
    ).reportConfig;
    this.initConfiguration();
  }

  initConfiguration() {
    let reportName = this.route.snapshot.params['report'] as ReportType;
    reportName = reportName && kebabToCamel(reportName);
    this.initReportConfigDetails(); //we are getting the report menu options from the config file

    //if there is no report selected, then select the first report from the list and navigate to that report
    !reportName &&
      this.router.navigate(
        [`${camelToKebab(this.reportsMenuOptions?.[0]?.value)}`],
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
    this.reportsService.showMenu.next(true);

    this.registerListener();
    this.initNavRoutes();
  }

  registerListener() {
    this.subscription$.add(
      this.reportsService.showMenu
        .pipe(
          switchMap((res) => {
            return of(
              res &&
                this.subscriptionPlanService.hasViewUserPermission({
                  type: 'module',
                  name: this.routesConfigService.subModuleName,
                })
            );
          })
        )
        .subscribe((res) => {
          this.showMenu = res;
          res && manageMaskZIndex(150);
        })
    );
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

    this.selectedProduct = this.routesConfigService.productName;

    this.settReportMainTitle();
    this.reportsMenuOptions =
      this.reportConfig[this.selectedProduct][this.selectedReportModule]
        ?.menu ?? [];
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = navRoutesRes;
      this.navRoutes = [
        ...this.navRoutes,
        {
          label: this.selectedReport?.label,
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
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
