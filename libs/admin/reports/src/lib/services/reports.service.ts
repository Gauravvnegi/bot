import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject, Subject } from 'rxjs';
import { GetReportQuery, ReportType } from '../types/reports.type';

@Injectable()
export class ReportsService extends ApiService {
  showMenu = new BehaviorSubject(true);
  $selectedReport = new BehaviorSubject<ReportType>(null);

  toggleMenu() {
    this.showMenu.next(!this.showMenu.value);
  }

  getReport(query: GetReportQuery, isExport = false) {
    return this.get(
      `/api/v1/reports${this.getQueryParam({
        ...query,
        ...(isExport ? { exportType: 'csv' } : {}),
      })}`
    );
  }
}
