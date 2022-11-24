import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { FormBuilder } from '@angular/forms';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { UserService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from 'libs/shared/material/src';
import { UserPermissionTable } from '../../models/user-permission-table.model';
import * as FileSaver from 'file-saver';
import { SortEvent } from 'primeng/api';
import { TableService } from 'libs/admin/shared/src/lib/services/table.service';

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
  tableName = 'Roles & Permissions';
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isTabFilters = false;

  cols = [
    {
      field: 'getFullName()',
      header: 'Name/Mobile & Email',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'getBrandAndBranchName()',
      header: 'Hotel Name & Branch/Job title',
      sortType: 'string',
      isSort: true,
    },
    {
      field: 'guests.primaryGuest.firstName',
      header: 'Permissions',
      isSort: false,
    },
    {
      field: 'arrivalAndDepartureDate',
      header: 'Manages By',
      sortType: 'string',
      isSort: false,
    },
    { field: 'package', header: 'Active', isSort: false },
  ];

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
    this.loadInitialData();
  }

  loadInitialData(queries = []) {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values = new UserPermissionTable().deserialize(data).records;
          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
      loggedInUserId: this.userService.getLoggedInUserid(),
    };

    return this._managePermissionService.getManagedUsers(config);
  }

  loadData(event) {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom([], {
        offset: this.first,
        limit: this.rowsPerPage,
      }).subscribe(
        (data) => {
          this.values = new UserPermissionTable().deserialize(data).records;

          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  updatePaginations(event) {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  exportCSV() {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.userId })),
      ]),
      loggedInUserId: this.userService.getLoggedInUserid(),
    };

    this.$subscription.add(
      this._managePermissionService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  updateRolesStatus(event, userData) {
    const data = {
      id: userData.userId,
      status: event.checked,
    };
    this._managePermissionService
      .updateRolesStatus(userData.parentId, data)
      .subscribe(
        (response) => {
          this.snackbarService.openSnackBarWithTranslate(
            {
              translateKey: `messages.SUCCESS.STATUS_UPDATED`,
              priorityMessage: 'Status Updated Successfully.',
            },
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
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
    this._router.navigate([`${rowData.userId}`], { relativeTo: this._route });
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

  goBack() {
    this.location.back();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
