import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  EntityState,
  NavRouteOption,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { Subscription } from 'rxjs';
import { GuestData, GuestTable } from '../../data-models/guest-table.model';
import { GuestTableService } from '../../services/guest-table.service';
import { manageGuestRoutes } from '../../constant/routes';
import { guestCols } from '../../constant/guest';
import { LazyLoadEvent } from 'primeng/api';
import {
  MemberSortTypes,
  SortingOrder,
} from 'libs/admin/agent/src/lib/types/agent';
import {
  SortBy,
  SortFilterList,
} from 'libs/admin/agent/src/lib/constant/response';
import { GuestListResponse, GuestTypes } from '../../types/guest.type';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { RoutesConfigService } from 'apps/admin/src/app/core/theme/src/lib/services/routes-config.service';
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
  sortFilterList = SortFilterList;
  entityId: string;
  cols = guestCols;
  globalQueries = [];
  $subscription = new Subscription();
  navRoutes: NavRouteOption[] = [
    {
      label: 'Members',
      link: './',
    },
  ];

  guestType: GuestTypes[] = ['NON_RESIDENT_GUEST', 'GUEST'];
  entityStateLabels: EntityState<string>;

  constructor(
    public fb: FormBuilder,
    protected adminUtilityService: AdminUtilityService,
    protected guestTableService: GuestTableService,
    protected globalFilterService: GlobalFilterService,
    private routesConfigService: RoutesConfigService
  ) {
    super(fb);
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
      this.guestTableService
        .getGuestList(this.getQueryConfig(SortBy[this.sortedBy]))
        .subscribe(
          (res) => {
            this.mapData(res);
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

  sortBy(key: MemberSortTypes) {
    this.sortedBy = key;
    if (this.searchKey) {
      this.searchGuest(this.searchKey);
      return;
    }
    this.loading = true;
    this.$subscription.add(
      this.guestTableService
        .sortMemberBy(this.getQueryConfig(SortBy[key]))
        .subscribe(
          (res) => {
            this.mapData(res);
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          },
          this.handleFinal
        )
    );
  }

  mapData(res: GuestListResponse) {
    const guestData = new GuestTable().deserialize(res);
    this.values = guestData.records;
    this.entityStateLabels = guestData?.entityStateLabels;
    this.initFilters(
      guestData.entityStateCounts,
      guestData.entityTypeCounts,
      guestData.totalRecord
    );
  }

  getQueryConfig(sortBy?: SortingOrder): QueryConfig {
    this.globalQueries = [
      {
        entityId: this.entityId,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        ...this.getSelectedQuickReplyFilters({ key: 'entityState' }),
        {
          type: this.guestType.join(','),
          entityId: this.entityId,
          order: 'DESC',
          sort: 'created',
          offset: this.first,
          limit: this.rowsPerPage,
          ...sortBy,
        },
      ]),
    };
    return config;
  }

  editGuest(event, rowData) {
    this.routesConfigService.navigate({
      additionalPath: `${manageGuestRoutes.editGuest.route}/${rowData.id}`,
    });
  }

  searchGuest(key: string) {
    if (!key.length) {
      this.getDataTableValue();
      this.searchKey = null;
      return;
    }
    this.searchKey = key;
    this.loading = true;
    this.guestTableService
      .searchGuest({
        params: this.adminUtilityService.makeQueryParams([
          {
            key: key,
            type: this.guestType.join(','),
            ...SortBy[this.sortedBy],
          },
        ]),
      })
      .subscribe((res) => {
        this.values = res.map((item) =>
          new GuestData().deserialize(item, this.entityStateLabels)
        );
        this.loading = false;
      });
  }

  exportCSV(): void {
    this.loading = true;

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: 'DESC',
          type: this.guestType.join(','),
          entityType: this.selectedTab,
          pagination: false,
          limit: this.totalRecords,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item?.id })),
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
