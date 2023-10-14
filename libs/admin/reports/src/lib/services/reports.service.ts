import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { BehaviorSubject } from 'rxjs';
import { GetReportQuery } from '../types/reports.type';

@Injectable()
export class ReportsService extends ApiService {
  showMenu = new BehaviorSubject(true);

  toggleMenu() {
    this.showMenu.next(!this.showMenu.value);
  }

  getReport(query: GetReportQuery, isExport = false) {
    this.get(
      `api/v1/reports${this.getQueryParam({
        ...query,
        ...(isExport ? { exportType: 'csv' } : {}),
      })}`
    );
  }
}
