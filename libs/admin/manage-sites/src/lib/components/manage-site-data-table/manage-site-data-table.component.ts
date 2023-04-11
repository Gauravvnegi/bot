import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  CookiesSettingsService,
  TableService,
  UserService,
} from '@hospitality-bot/admin/shared';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

import {
  SnackBarService,
  ModalService,
} from '@hospitality-bot/shared/material';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { chips, cols, status } from '../../constant/data-table';
import { ManageSiteStatus } from '../../constant/manage-site';
import { ManageSite, ManageSiteList } from '../../models/data-table.model';
import { ManageSitesService } from '../../services/manage-sites.service';
import { QueryConfig } from '../../types/manage-site.type';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SettingOptions } from '@hospitality-bot/admin/settings';

@Component({
  selector: 'hospitality-bot-manage-site-data-table',
  templateUrl: './manage-site-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './manage-site-data-table.component.scss',
  ],
})
export class ManageSiteDataTableComponent extends BaseDatatableComponent {
  hotelId: string;
  filterChips = chips;
  cols = cols;
  status = status;
  isSelectable = false;
  tableName = 'Partner Dashboard';
  userId: string;

  $subscription = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private userService: UserService,
    private manageSiteService: ManageSitesService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private cookiesSettingService: CookiesSettingsService,
    private modalService: ModalService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.userId = this.userService.getLoggedInUserId();
    this.initTableValue();
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
      this.manageSiteService
        .getSitesList(this.userId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const manageSiteData = new ManageSiteList().deserialize(res);
            this.values = manageSiteData.records;
            this.totalRecords = manageSiteData.total;
            this.filterChips.forEach((item) => {
              item.total = manageSiteData.entityTypeCounts[item.value];
            });
          },
          this.handleError,
          this.handleFinal
        )
    );
  }

  selectSite(rowData) {
    if (rowData.id) {
      this.cookiesSettingService.initPlatformChange(rowData.id, '/pages');
    }
  }

  handleStatus(status: ManageSiteStatus, rowData: ManageSite) {
    if (
      status === ManageSiteStatus.PUBLISHED &&
      rowData.status === ManageSiteStatus.DRAFT
    ) {
      /** If Site is in draft state */
      this.handlePublish(rowData.id);
    } else {
      this.loading = true;
      this.$subscription.add(
        this.manageSiteService
          .updateSiteStatus(this.userId, rowData.id, status)
          .subscribe(
            () => {
              this.loading = false;
              this.snackbarService.openSnackBarAsText(
                'Status changes successfully',
                '',
                { panelClass: 'success' }
              );
              this.updateStatusAndCount(rowData.status, status);
              this.values.find(
                (item) => item.id === rowData.id
              ).status = status;
            },
            this.handleError,
            this.handleFinal
          )
      );
    }
  }

  /**
   * @function handlePublish Handle Publishing of site
   */
  handlePublish(hotelId) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );

    togglePopupCompRef.componentInstance.content = {
      heading: 'Cannot publish Page',
      description: [
        'You Cannot publish your page until you publish your website first.',
      ],
    };
    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'Go to Website Settings',
        onClick: () => {
          this.modalService.close();
          this.cookiesSettingService.initPlatformChange(
            hotelId,
            `/pages/settings/${SettingOptions.WEBSITE_SETTING}`
          );
        },
        variant: 'contained',
      },
    ];

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.filterChips.filter(
      (item) => item.isSelected && item.value !== 'ALL'
    );
    return chips.map((item) => ({ status: item.value }));
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

  getStatusList(currentStatus: ManageSiteStatus) {
    return this.status.map((item) => ({
      ...item,
      disabled:
        (currentStatus !== ManageSiteStatus.DRAFT &&
          item.value === ManageSiteStatus.DRAFT) ||
        (currentStatus === ManageSiteStatus.DRAFT &&
          item.value === ManageSiteStatus.INACTIVE),
    }));
  }

  /**
   * To network handle error
   * @param param0 network error
   */
  handleError = ({ error }) => {
    this.values = [];
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
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
