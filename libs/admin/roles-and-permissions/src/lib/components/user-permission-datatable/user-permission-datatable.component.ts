import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Option, UserService, openModal } from '@hospitality-bot/admin/shared';
import * as FileSaver from 'file-saver';
import { BaseDatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/base-datatable.component';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Observable, Subscription, of } from 'rxjs';
import { ServiceItemUserList, User, UserPermissionTable } from '../../models/user-permission-table.model';
import { ManagePermissionService } from '../../services/manage-permission.service';
import { QueryConfig } from '../../types';
import { chips, cols, tableName } from '../../constants/data-table';
import { LazyLoadEvent, MenuItem } from 'primeng/api';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

const UserAvailabilityStatus = {
    Available: 'AVAILABLE',
    Unavailable: 'UNAVAILABLE'
} as const;

type UserAvailabilityStatus = typeof UserAvailabilityStatus[keyof typeof UserAvailabilityStatus];

const UserTableType = {
    All: 'ALL',
    ServiceItem: 'SERVICE_ITEM'
} as const;

type UserTableType = typeof UserTableType[keyof typeof UserTableType];

export type UserPermissionResponse = {
    userId?: string;
    isView?: boolean;
};
@Component({
    selector: 'hospitality-bot-user-permission-datatable',
    templateUrl: './user-permission-datatable.component.html',
    styleUrls: [
        '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
        './user-permission-datatable.component.scss'
    ]
})
export class UserPermissionDatatableComponent extends BaseDatatableComponent implements OnInit, OnDestroy {
    loggedInUserId: string;
    @Input() tabFilterIdx = 1;
    @Input() tableType: UserTableType = UserTableType.All;
    @Input() serviceItemId: string;

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
    menuOptions: Option[] = [];
    isPopUpVisible: boolean = false;
    popUpContent: Partial<ModalComponent>;
    popupForm: FormGroup;
    readonly UserAvailabilityStatus = UserAvailabilityStatus;

    constructor(
        public fb: FormBuilder,
        private _adminUtilityService: AdminUtilityService,
        private _managePermissionService: ManagePermissionService,
        public userService: UserService,
        private snackbarService: SnackBarService,
        private dialogConfig: DynamicDialogConfig,
        private dialogRef: DynamicDialogRef,
        private dialogService: DialogService
    ) {
        super(fb);
        /**
         * @Remarks Extracting data from he dialog service
         */
        if (this.dialogConfig?.data) {
            Object.entries(this.dialogConfig.data).forEach(([key, value]) => {
                this[key] = value;
            });
        }
    }

    ngOnInit(): void {
        this.entityId = this.userService.getentityId();
        this.loggedInUserId = this.userService.getLoggedInUserId();
        this.loadInitialData();
        this.initPopupForm();
    }

    loadInitialData() {
        this.loading = true;

        switch (this.tableType) {
            case UserTableType.All:
                this.$subscription.add(
                    this._managePermissionService.getAllUsers(this.entityId, this.getQueryConfig()).subscribe(
                        (allUsersData) => {
                            const manageUsersValues = new UserPermissionTable().deserialize(allUsersData);
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
                break;
            case UserTableType.ServiceItem:
                this.isAllTabFilterRequired = false;
                this.subscriptionList$.add(
                    this._managePermissionService
                        .getServiceItemUsers(this.entityId, this.serviceItemId, this.getQueryConfig())
                        .subscribe(
                            (response) => {
                                const data = new ServiceItemUserList().deserialize(response);
                                this.values = data.records;
                                this.totalRecords = data.totalRecords;

                                this.initFilters(undefined, data.entityStateCounts, data.totalRecords);
                                this.loading = false;
                            },
                            (error) => {
                                this.allUsersValues = [];
                                this.manageUsersValues = [];
                                this.loading = false;
                            }
                        )
                );
                break;
        }
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
                            : this.tabFilterItems[this.tabFilterIdx]?.value ?? ''
                }
            ])
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
        this.$subscription.add(
            this.getExportCsvApi().subscribe(
                (res) => {
                    FileSaver.saveAs(res, `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`);
                    this.loading = false;
                },
                ({ error }) => {
                    this.loading = false;
                }
            )
        );
    }

    getExportCsvApi(): Observable<any> {
        const config: QueryConfig = {
            queryObj: this._adminUtilityService.makeQueryParams([
                ...this.selectedRows.map((item) => ({ ids: item.userId })),
                ...this.getSelectedQuickReplyFilters({ isStatusBoolean: true }),
                {
                    type:
                        this.tabFilterItems[this.tabFilterIdx]?.value === 'ALL'
                            ? ''
                            : this.tabFilterItems[this.tabFilterIdx]?.value ?? '',
                    limit: this.totalRecords
                }
            ]),
            loggedInUserId: this.userService.getLoggedInUserId(),
            entityId: this.entityId
        };

        switch (this.tableType) {
            case UserTableType.All:
                return this._managePermissionService.exportCSV(
                    config,
                    this.tabFilterItems[this.tabFilterIdx].value === 'ALL'
                );
            case UserTableType.ServiceItem:
                return this._managePermissionService.exportServiceItemUsers(this.entityId, this.serviceItemId, config);
        }
    }

    handelStatus(status: boolean, userData, force?: boolean) {
        if (!status) {
            this._managePermissionService.getUserJobDetails(userData.userId).subscribe((res) => {
                if (res.defaultServiceItemUser) {
                    this.snackbarService.openSnackBarAsText(
                        'Cannot mark the user as inactive. The user is  marked default user for service items',
                        ''
                    );
                    return;
                }

                let description = [
                    `Are you sure you want to deactivate the user?`,
                    `user have ${res?.pendingJobs} jobs pending`
                ];
                let label: string = 'Deactivate';

                //api call to check if user have any jobs pending
                if (!res.pendingJobs) {
                    description = [`Are you sure you want to deactivate the user?`];
                }
                if (force) {
                    description = [
                        `Are you sure you want to force deactivate the user?`,
                        `User status cannot be updated as there are other users which are reporting to this user.`
                    ];
                    label = 'Force Deactivate';
                }

                let dialogRef: DynamicDialogRef;
                const modalData: Partial<ModalComponent> = {
                    heading: `Mark As ${status ? 'Active' : 'Inactive'}`,
                    descriptions: description,
                    actions: [
                        {
                            label: 'Cancel',
                            onClick: () => {
                                dialogRef.close();
                            },
                            variant: 'outlined'
                        },
                        {
                            label: label,
                            onClick: () => {
                                this.updateRolesStatus(
                                    status,
                                    userData,
                                    force ? { queryObj: '?forceUpdate=true' } : {}
                                );
                                dialogRef.close();
                            },
                            variant: 'contained'
                        }
                    ]
                };

                dialogRef = openModal({
                    config: {
                        styleClass: 'confirm-dialog',
                        data: modalData
                    },
                    dialogService: this.dialogService,
                    component: ModalComponent
                });
            });
        } else {
            this.updateRolesStatus(status, userData);
        }
    }

    updateRolesStatus(status: boolean, userData, config?: QueryConfig) {
        const data = {
            id: userData.userId,
            status: status
        };
        this._managePermissionService.updateRolesStatus(userData.parentId, data, config).subscribe(
            (_) => {
                this.loadInitialData();
                this.snackbarService.openSnackBarWithTranslate(
                    {
                        translateKey: `messages.SUCCESS.STATUS_UPDATED`,
                        priorityMessage: 'Status Updated Successfully.'
                    },
                    '',
                    { panelClass: 'success' }
                );
            },
            ({ error }) => {
                if (error?.type === 'STATUS_CANNOT_BE_UPDATED') this.handelStatus(status, userData, true);
            }
        );
    }

    initPopupForm() {
        this.popupForm = this.fb.group({
            status: [],
            hours: ['1', [Validators.pattern(/^\d+$/)]]
        });

        this.popupForm.get('hours').valueChanges.subscribe((value: number) => {
            if (!value) {
                this.popupForm.get('hours').setValue(1);
            }
        });
    }

    handleMenuClick(event: UserAvailabilityStatus, data: User) {
        if (event === UserAvailabilityStatus.Unavailable) {
            this.isPopUpVisible = true;
            this.popUpContent = {
                heading: 'Mark as Unavailable',
                descriptions: [
                    'Are you sure you want to mark this user as unavailable?',
                    'Once marked unavailable, this user will not be assigned to any task.',
                    'You can always make them available again.'
                ],
                actions: [
                    {
                        label: 'Cancel',
                        onClick: () => {
                            this.isPopUpVisible = false;
                        },
                        variant: 'outlined'
                    },
                    {
                        label: 'Unavailable',
                        onClick: () => {
                            if (this.popupForm.invalid && this.popupForm.get('status').value) {
                                this.snackbarService.openSnackBarAsText('Please enter valid hours format', '', {});
                                return;
                            }

                            this.updateUserAvailability(false, data);
                        },
                        variant: 'contained'
                    }
                ]
            };
        } else {
            this.updateUserAvailability(true, data);
        }
    }

    updateUserAvailability(condition: boolean, userDetails: User) {
        const data = this.popupForm.getRawValue();

        const config: QueryConfig = {
            queryObj: this._adminUtilityService.makeQueryParams([
                {
                    available: condition,
                    ...(data?.status && { unavailableDuration: data?.hours })
                }
            ])
        };

        this._managePermissionService.updateUserAvailability(userDetails.userId, config).subscribe(() => {
            this.isPopUpVisible = false;
            this.popupForm.setValue({
                status: false,
                hours: '1'
            });
            this.loadInitialData();
        });
    }

    openUserDetails(rowData) {
        this.dialogRef.close({
            userId: rowData?.userId,
            isView: this.isEditAccessDenied(rowData)
        });
    }

    isEditAccessDenied(rowData) {
        return (
            !(rowData?.parentId === this.loggedInUserId || rowData?.reportingTo === this.loggedInUserId) ||
            !rowData?.parentId
        );
    }

    /**
     * @function closeModal To emit user id on close modal
     */
    closeModal(): void {
        this.dialogRef.close();
    }

    ngOnDestroy() {
        this.$subscription.unsubscribe();
    }
}
