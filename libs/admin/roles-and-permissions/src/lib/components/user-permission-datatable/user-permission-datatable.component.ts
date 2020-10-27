import { Component, OnInit, OnDestroy } from '@angular/core';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { UserDetailService } from 'libs/admin/shared/src/lib/services/user-detail.service';
import { SnackBarService } from 'libs/shared/material/src';
import { UserPermissionTable } from '../../models/user-permission-table.model';
import * as FileSaver from 'file-saver';

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
    { field: 'firstName', header: 'Name/Mobile & Email' },
    { field: 'booking.bookingNumber', header: 'Hotel Name & Branch/Job title' },
    { field: 'guests.primaryGuest.firstName', header: 'Permissions' },
    { field: 'arrivalAndDepartureDate', header: 'Manages By' },
    { field: 'package', header: 'Active' },
  ];

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _adminUtilityService: AdminUtilityService,
    private _managePermissionService: ManagePermissionService,
    public userDetailService: UserDetailService,
    private _snackbarService: SnackBarService
  ) {
    super(fb);
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
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: 0, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
      loggedInUserId: this.userDetailService.getLoggedInUserid(),
    };

    return this._managePermissionService.getManagedUsers(config);
  }

  loadData(event) {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom([], {
        offset: event.first,
        limit: event.rows,
      }).subscribe(
        (data) => {
          this.values = new UserPermissionTable().deserialize(data).records;

          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  exportCSV() {
    this.loading = true;

    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.userId })),
      ]),
      loggedInUserId: this.userDetailService.getLoggedInUserid(),
    };

    this.$subscription.add(
      this._managePermissionService.exportCSV(config).subscribe(
        (res) => {
          FileSaver.saveAs(
            res,
            this.tableName.toLowerCase() +
              '_export_' +
              new Date().getTime() +
              '.csv'
          );
          this.loading = false;
        },
        (error) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  addUser() {
    this._router.navigate(['add-user'], { relativeTo: this._route });
  }

  openUserDetails(rowData) {
    this._router.navigate([`${rowData.userId}`], { relativeTo: this._route });
  }

  onFilterTypeTextChange(value, field, matchMode = 'startsWith') {
    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
