import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';
import { SnackBarService } from 'libs/shared/material/src';
import { SortEvent } from 'primeng/api';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { UserPermissionTable } from '../../models/user-permission-table.model';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { QueryConfig } from '../../types';
import { chips, cols, tableName } from '../../constants/data-table';

@Component({
  selector: 'hospitality-bot-user-permission-datatable',
  templateUrl: './user-permission-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './user-permission-datatable.component.scss',
  ],
})
export class UserPermissionDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @Output() onModalClose = new EventEmitter();
  @Input() tabFilterIdx = 1;

  tableName = tableName;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isQuickFilters = false;
  isTabFilters = true;
  tabFilterItems = [
    {
      label: 'All',
      content: '',
      value: 'ALL',
      disabled: false,
      total: 0,
      chips: [],
    },
    {
      label: 'Reporting to me',
      content: '',
      value: 'REPORTING',
      disabled: false,
      total: 0,
      chips: [],
    },
  ];
  entityId: string;
  filterChips = chips;
  cols = cols;
  allUsersValues;
  manageUsersValues;
  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _adminUtilityService: AdminUtilityService,
    private _managePermissionService: ManagePermissionService,
    public userService: UserService,
    private snackbarService: SnackBarService,
    private location: Location,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.userService.getentityId();
    this.loadInitialData();
  }

  loadInitialData(queries = []) {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        ([allUsersData, manageUsersData]) => {
          this.allUsersValues = new UserPermissionTable().deserialize(
            allUsersData
          ).records;
          this.manageUsersValues = new UserPermissionTable().deserialize(
            manageUsersData
          ).records;
          //set pagination
          this.setTableValues();

          this.tabFilterItems[0].total = allUsersData.total;
          this.tabFilterItems[1].total = manageUsersData.total;
          this.loading = false;
        },
        (error) => {
          this.allUsersValues = [];
          this.manageUsersValues = [];
          this.loading = false;
        }
      )
    );
  }

  setTableValues() {
    this.values =
      this.tabFilterIdx === 0 ? this.allUsersValues : this.manageUsersValues;
    this.totalRecords = this.tabFilterItems[this.tabFilterIdx].total;
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config: QueryConfig = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
      loggedInUserId: this.userService.getLoggedInUserId(),
      entityId: this.entityId,
    };
    const allUsers$ = this._managePermissionService.getAllUsers(config);
    const managedUsers$ = this._managePermissionService.getManagedUsers(config);

    return forkJoin([allUsers$, managedUsers$]);
  }

  loadData(event) {
    this.loading = true;
    this.updatePaginations(event);
    this.loadInitialData();
  }

  onSelectedTabFilterChange({ index }) {
    this.tabFilterIdx = index;
    this.setTableValues();

    // this.loadInitialData();
  }

  exportCSV() {
    this.loading = true;

    const config: QueryConfig = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.userId })),
      ]),
      loggedInUserId: this.userService.getLoggedInUserId(),
      entityId: this.entityId,
    };

    this.$subscription.add(
      this._managePermissionService
        .exportCSV(
          config,
          this.tabFilterItems[this.tabFilterIdx].value === 'ALL'
        )
        .subscribe(
          (res) => {
            FileSaver.saveAs(
              res,
              `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
            );
            this.loading = false;
          },
          (error) => {
            this.loading = false;
          }
        )
    );
  }

  updateRolesStatus(status: boolean, userData) {
    const data = {
      id: userData.userId,
      status: status,
    };
    this._managePermissionService
      .updateRolesStatus(userData.parentId, data)
      .subscribe(
        (_) => {
          const statusValue = (val: boolean) => (val ? 'ACTIVE' : 'INACTIVE');
          this.updateStatusAndCount(
            statusValue(userData.status),
            statusValue(status)
          );
          this.allUsersValues.find(
            (item) => item.id === userData.id
          ).status = status;
          this.manageUsersValues.find(
            (item) => item.id === userData.id
          ).status = status;

          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.STATUS_UPDATED`,
              priorityMessage: 'Status Updated Successfully.',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {}
      );
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    const field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  addUser() {
    this._router.navigate(['add-user'], { relativeTo: this._route });
  }

  openUserDetails(rowData) {
    if (this.tabFilterItems[this.tabFilterIdx].value === 'REPORTING')
      this.closeModal(rowData.userId);
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
    // value = value && value.trim();
    // this.table.filter(value, field, matchMode);

    if (!!value && !this.isSearchSet) {
      this.tempFirst = this.first;
      this.tempRowsPerPage = this.rowsPerPage;
      this.isSearchSet = true;
    } else if (!!!value) {
      this.isSearchSet = false;
      this.first = this.tempFirst;
      this.rowsPerPage = this.tempRowsPerPage;
    }

    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }

  /**
   * @function closeModal To emit user id on close modal
   * @param userId
   */
  closeModal(userId?: string): void {
    this.onModalClose.emit(userId);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
