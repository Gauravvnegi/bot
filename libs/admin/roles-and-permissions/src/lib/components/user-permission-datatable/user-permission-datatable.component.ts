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
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { Observable, Subscription, forkJoin } from 'rxjs';
import { UserPermissionTable } from '../../models/user-permission-table.model';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { QueryConfig } from '../../types';
import { chips, cols, tableName } from '../../constants/data-table';
import { get } from 'lodash';
import { LazyLoadEvent } from 'primeng/api';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

@Component({
  selector: 'hospitality-bot-user-permission-datatable',
  templateUrl: './user-permission-datatable.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './user-permission-datatable.component.scss',
  ],
  providers: [ModalService],
})
export class UserPermissionDatatableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  @Output() onModalClose = new EventEmitter<{
    userId?: string;
    isView?: boolean;
  }>();
  loggedInUserId: string;
  @Input() tabFilterIdx = 1;

  tableName = tableName;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  isQuickFilters = false;
  isTabFilters = true;
  entityId: string;
  filterChips = chips;
  cols = cols;
  allUsersValues;
  manageUsersValues;
  $subscription = new Subscription();
  isAllTabFilterRequired = true;

  constructor(
    public fb: FormBuilder,
    private _router: Router,
    private _route: ActivatedRoute,
    private _adminUtilityService: AdminUtilityService,
    private _managePermissionService: ManagePermissionService,
    public userService: UserService,
    private snackbarService: SnackBarService,
    protected tabFilterService: TableService,
    private modalService: ModalService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.userService.getentityId();
    this.loggedInUserId = this.userService.getLoggedInUserId();
    this.loadInitialData();
  }

  loadInitialData(queries = []) {
    this.loading = true;
    this.$subscription.add(
      this._managePermissionService
        .getAllUsers(this.entityId, this.getQueryConfig())
        .subscribe(
          (allUsersData) => {
            const manageUsersValues = new UserPermissionTable().deserialize(
              allUsersData
            );
            this.values = manageUsersValues.records;
            this.totalRecords = manageUsersValues.totalRecords;

            this.initFilters(
              manageUsersValues.entityTypeCounts,
              manageUsersValues.entityStateCounts,
              manageUsersValues.totalRecords
            );

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

  getQueryConfig() {
    const config = {
      params: this._adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({ isStatusBoolean: true }),
        ...[{ order: 'DESC' }],
        {
          offset: this.first,
          limit: this.rowsPerPage,
          type:
            this.tabFilterItems[this.tabFilterIdx]?.value === 'ALL'
              ? ''
              : this.tabFilterItems[this.tabFilterIdx]?.value ?? '',
        },
      ]),
    };

    return config;
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent) {
    this.loadInitialData();
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

  handelStatus(status: boolean, userData, force?: boolean) {
    if (!status) {
      this._managePermissionService
        .getUserJobDetails(userData.userId)
        .subscribe((res) => {
          const dialogConfig = new MatDialogConfig();
          dialogConfig.disableClose = true;
          const togglePopupCompRef = this.modalService.openDialog(
            ModalComponent,
            dialogConfig
          );
          let description = [
            `Are you sure you want to deactivate the user?`,
            `user have ${res?.length} jobs pending`,
          ];
          let label: string = 'Deactivate';

          //api call to check if user have any jobs pending
          if (!res) {
            description = [`Are you sure you want to deactivate the user?`];
          }
          if (force) {
            description = [
              `Are you sure you want to force deactivate the user?`,
              `User status cannot be updated as there are other users which are reporting to this user.`,
            ];
            label = 'Force Deactivate';
          }

          togglePopupCompRef.componentInstance.content = {
            heading: `Mark As ${status ? 'Active' : 'Inactive'}`,
            description: description,
          };

          togglePopupCompRef.componentInstance.actions = [
            {
              label: 'Cancel',
              onClick: () => this.modalService.close(),
              variant: 'outlined',
            },
            {
              label: label,
              onClick: () => {
                this.updateRolesStatus(
                  status,
                  userData,
                  force ? { queryObj: '?forceUpdate=true' } : {}
                );
                togglePopupCompRef.close();
              },
              variant: 'contained',
            },
          ];

          togglePopupCompRef.componentInstance.onClose.subscribe(() => {
            togglePopupCompRef.close();
          });
        });
    } else {
      this.updateRolesStatus(status, userData);
    }
  }

  updateRolesStatus(status: boolean, userData, config?: QueryConfig) {
    const data = {
      id: userData.userId,
      status: status,
    };
    this._managePermissionService
      .updateRolesStatus(userData.parentId, data, config)
      .subscribe(
        (_) => {
          this.loadInitialData();
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
          if (error?.type === 'STATUS_CANNOT_BE_UPDATED')
            this.handelStatus(status, userData, true);
        }
      );
  }

  addUser() {
    this._router.navigate(['add-user'], { relativeTo: this._route });
  }

  openUserDetails(rowData) {
    this.onModalClose.emit({
      userId: rowData?.userId,
      isView: rowData?.parentId !== this.userService.getLoggedInUserId(),
    });
  }

  isEditAccessDenied(rowData) {
    return !(
      rowData?.parentId === this.loggedInUserId ||
      rowData?.reportingTo === this.loggedInUserId
    );
  }

  /**
   * @function closeModal To emit user id on close modal
   */
  closeModal(): void {
    this.onModalClose.emit();
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
