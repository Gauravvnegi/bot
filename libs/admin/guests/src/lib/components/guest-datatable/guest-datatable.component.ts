import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  QueryConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { GuestTable } from '../../data-models/guest-table.model';
import { GuestTableService } from '../../services/guest-table.service';
import { manageGuestRoutes } from '../../constant/route';
import { guestCols } from '../../constant/guest';
import { LazyLoadEvent } from 'primeng/api';
import { Route, Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-guest-datatable',
  templateUrl: './guest-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './guest-datatable.component.scss',
  ],
})
export class GuestDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  tableName = 'Guest List';

  guestRoutes = manageGuestRoutes;
  isQuickFilters = false;
  isTabFilters = false;

  entityId: string;
  cols = guestCols;
  globalQueries = [];
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected adminUtilityService: AdminUtilityService,
    protected guestTableService: GuestTableService,
    protected globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getDataTableValue();
  }

  loadData(event: LazyLoadEvent): void {
    this.getDataTableValue();
  }

  getDataTableValue() {
    this.loading = true;
    this.$subscription.add(
      this.guestTableService.getGuestList(this.getQueryConfig()).subscribe(
        (res) => {
          const guestData = new GuestTable().deserialize(res);
          this.values = guestData.records;
          this.initFilters(
            guestData.entityTypeCounts,
            guestData.entityStateCounts,
            guestData.totalRecord
          );
          this.loading = false;
        },
        (error) => {
          this.values = [];
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  getQueryConfig(): QueryConfig {
    // TODO: We have to remove toDate & fromDate after getting api of guest list
    this.globalQueries = [
      {
        entityId: this.entityId,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFiltersV2({ key: 'entityState' }),
        {
          type: 'GUEST',
          entityId: this.entityId,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  editGuest(event, rowData) {
    this.router.navigate([
      `/pages/members/guests/${manageGuestRoutes.editGuest.route}/${rowData.id}`,
    ]);
  }

  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          entityType: this.selectedTab,
        },
        ...this.getSelectedQuickReplyFiltersV2(),
        ...this.selectedRows.map((item) => ({ ids: item.booking.bookingId })),
      ]),
    };
    this.$subscription.add(
      this.guestTableService.exportCSV(config).subscribe(
        (response) => {
          FileSaver.saveAs(
            response,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        ({ error }) => {
          this.values = [];
          this.loading = false;
        }
      )
    );
  }

  handleFinal() {
    this.loading = false;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
