import { Component, OnInit } from '@angular/core';
import { FIREBASE_OPTIONS } from '@angular/fire';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  NavRouteOptions,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { LazyLoadEvent } from 'primeng/api';
import { Subject, Subscription } from 'rxjs';
import { config } from '../../constants/kot-datatable.constant';
import { Config } from '../../types/kot-card.type';

@Component({
  selector: 'hospitality-bot-kot-table',
  templateUrl: './kot-table.component.html',
  styleUrls: [
    './kot-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class KotTableComponent extends BaseDatatableComponent
  implements OnInit {
  navRoutes: NavRouteOptions = [];
  values: Config[] = [];
  pageTitle: string = 'KOT';
  loading: boolean = false;
  entityId: string;
  $subscription = new Subscription();
  private cancelRequests$ = new Subject<void>();

  constructor(
    fb: FormBuilder,
    private adminUtilityService: AdminUtilityService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.values = [];
    for (let i = 0; i < 5; i++) {
      this.values.push(config);
    }
  }

  loadData(event: LazyLoadEvent): void {
    this.cancelRequests$.next();
  }

  /**
   * @function getQueryConfig To get query config
   * @returns QueryConfig
   */

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({
          key: 'roomStatus',
        }),
        {
          offset: '0',
          limit: '0',
          raw: true,
        },
      ]),
    };
    return config;
  }
}
