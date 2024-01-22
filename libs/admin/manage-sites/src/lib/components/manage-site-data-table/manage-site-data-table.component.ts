import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  CookiesSettingsService,
  Option,
  UserService,
  ModuleNames,
  openModal,
} from '@hospitality-bot/admin/shared';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

import { SnackBarService } from '@hospitality-bot/shared/material';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import {
  MenuOptions,
  cols,
  manageSiteStatus,
  status,
} from '../../constant/data-table';
import { ManageSiteStatus } from '../../constant/manage-site';
import { ManageSite, ManageSiteList } from '../../models/data-table.model';
import { ManageSitesService } from '../../services/manage-sites.service';
import { NextState, QueryConfig } from '../../types/manage-site.type';
import { environment } from '@hospitality-bot/admin/environment';
import { siteStatusDetails } from '../../constants/response';
import { RouteConfigPathService } from '@hospitality-bot/admin/core/theme';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'hospitality-bot-manage-site-data-table',
  templateUrl: './manage-site-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './manage-site-data-table.component.scss',
  ],
})
export class ManageSiteDataTableComponent extends BaseDatatableComponent {
  readonly siteStatusDetails = siteStatusDetails;
  createSiteUrl: string;

  entityId: string;
  cols = cols;
  status = status;
  manageSiteStatus = manageSiteStatus;
  isSelectable = false;
  tableName = 'Partner Dashboard';
  userId: string;
  nextState: NextState[];
  $subscription = new Subscription();

  menuOptions: Option[] = MenuOptions;

  constructor(
    public fb: FormBuilder,
    private userService: UserService,
    private manageSiteService: ManageSitesService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private cookiesSettingService: CookiesSettingsService,
    private dialogService: DialogService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.userId = this.userService.getLoggedInUserId();
    this.initTableValue();
    this.createSiteUrl = `${environment.createWithUrl}/theme/select?userId=${this.userId}&creatingNewSite=true`;
    this.cookiesSettingService.initCookiesForPlatform();
  }

  /**
   * @function loadData Fetch data as paginates
   * @param event
   */
  loadData(event: LazyLoadEvent): void {
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.getSitesList();
  }

  /**
   * To Get site list data
   */
  getSitesList() {
    this.$subscription.add(
      this.manageSiteService.getSitesList(this.getQueryConfig()).subscribe(
        (res) => {
          const manageSiteData = new ManageSiteList().deserialize(res);
          this.values = manageSiteData.records;
          this.nextState = this.values.map((item) => ({
            id: item.id,
            status: item.status,
            value: item.nextState,
          }));
          this.initFilters(
            manageSiteData.entityStateCounts,
            manageSiteData.entityTypeCounts,
            manageSiteData.total,
            this.manageSiteStatus
          );
        },
        () => {
          this.values = [];
        },
        this.handleFinal
      )
    );
  }

  selectSite(rowData) {
    if (
      rowData.id &&
      rowData.status !== ManageSiteStatus.DELETE &&
      rowData.status !== ManageSiteStatus.TRASH
    ) {
      this.cookiesSettingService.initPlatformChange(rowData.id, '/');
    }
  }

  handleMenuClick(value: string, rowData: ManageSite) {
    switch (value) {
      case 'EDIT':
        this.selectSite(rowData);
        break;
      case 'CLONE':
        break;
      case 'DELETE':
        break;
      case 'COPY_URL':
        break;
    }
  }

  handleStatus(status: ManageSiteStatus, rowData: ManageSite) {
    if (status === ManageSiteStatus.PUBLISHED) {
      this.changeStatus(status, rowData);
      return;
    }

    const currStatus =
      status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    // let heading: string;
    let description: string[] = [
      `You are about to mark this site ${currStatus}`,
    ];
    let label: string = 'Confirm';

    if (status === ManageSiteStatus.DRAFT) {
      description = [
        'Are you sure you want to unpublish your website?',
        'Once unpublished, it wont be visible to visitors.',
        'You can always Publish it again.',
      ];
      label = 'Unpublish';
    }

    if (status === ManageSiteStatus.TRASH) {
      description = [
        'Are you sure you want to move your website to the trash?',
        'Once moved, it will become invisible and inactive.',
        'You can always restore it again.',
      ];
      label = 'Trash';
    }

    let dialogRef: DynamicDialogRef;
    const modalData: Partial<ModalComponent> = {
      heading: `Mark As ${currStatus}`,
      descriptions: description,
      actions: [
        {
          label: 'Cancel',
          onClick: () => dialogRef.close(),
          variant: 'outlined',
        },
        {
          label: label,
          onClick: () => {
            this.changeStatus(status, rowData);
            dialogRef.close();
          },
          variant: 'contained',
        },
      ],
    };
    dialogRef = this.openDynamicModal(modalData);
  }

  changeStatus(status: ManageSiteStatus, rowData: ManageSite) {
    this.loading = true;
    this.$subscription.add(
      this.manageSiteService.updateSiteStatus(rowData.id, status).subscribe(
        () => {
          this.loading = false;
          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
          this.initTableValue();
        },
        ({ error }) => {
          if (
            error?.type === 'DOMAIN_NOT_EXIST' ||
            error?.code === 'BOTSHOT1057'
          ) {
            this.handlePublish(rowData.id);
          }
          this.loading = false;
        }
      )
    );
  }
  /**
   * @function handlePublish Handle Publishing of site
   */
  handlePublish(entityId) {
    let dialogRef: DynamicDialogRef;
    const modalData: Partial<ModalComponent> = {
      heading: 'Cannot publish Page',
      descriptions: ['Connect your domain to publish your website'],
      actions: [
        {
          label: 'Go to Website Settings',
          onClick: () => {
            dialogRef.close();
            const routeConfig = new RouteConfigPathService();
            this.cookiesSettingService.initPlatformChange(
              entityId, // siteId
              `/${routeConfig.getRouteFromName(
                ModuleNames.CREATE_WITH
              )}/${routeConfig.getRouteFromName(
                ModuleNames.SETTINGS
              )}/${routeConfig.getRouteFromName(ModuleNames.WEBSITE_SETTINGS)}`
            );
          },
          variant: 'contained',
        },
      ],
    };
    dialogRef = this.openDynamicModal(modalData);
  }

  openDynamicModal(modalData: Partial<ModalComponent>): DynamicDialogRef {
    return openModal({
      config: {
        styleClass: 'confirm-dialog',
        data: modalData,
      },
      component: ModalComponent,
      dialogService: this.dialogService,
    });
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        {
          // not using pagination as of now
          // offset: this.first,
          // limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  getStatusList(currentStatus: ManageSite) {
    return this.status.filter((item) => {
      const next = this.nextState.find((item) => item.id === currentStatus.id)
        .value;
      next.push(currentStatus.status);
      return next.includes(item.value);
    });
  }

  /**
   * To network handle error
   * @param param0 network error
   */
  handleError = ({ error }) => {
    this.loading = false;
  };

  /**
   * To handle final
   */
  handleFinal = () => {
    this.loading = false;
  };

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
