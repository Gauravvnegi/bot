import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { templateConfig } from '../../constants/template';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-import-asset',
  templateUrl: './import-asset.component.html',
  styleUrls: ['./import-asset.component.scss'],
})
export class ImportAssetComponent implements OnInit, OnDestroy {
  @Output() closeImport = new EventEmitter();
  searchValue = false;
  entityId: string;
  tabFilterItems = templateConfig.datatable.assetsTabFilterItems;
  tabFilterIdx = 0;
  limit = templateConfig.importAsset.limit;
  assets = [];
  $subscription = new Subscription();
  assetFG: FormGroup;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private _templateService: TemplateService,
    private _fb: FormBuilder,
    private snackbarService: SnackBarService,
    protected translateService: TranslateService
  ) {}
  ngOnInit(): void {
    this.registerListeners();
  }

  /**
   * @function registerListeners function to listen for search changes and global filters.
   */
  registerListeners() {
    this.listenForGlobalFilters();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        // fetch-api for records
        this.loadAssetData([
          {
            offset: 0,
          },
        ]);
      })
    );
  }

  /**
   * @function onTabChanged function to handle tab change event.
   */
  onTabChanged(event) {
    this.tabFilterIdx = event.index;
    this.assets = [];
    this.tabFilterItems[this.tabFilterIdx].page = 0;
    this.loadAssetData([
      {
        offset: 0,
      },
    ]);
  }

  /**
   * @function loadAssetData function to load asset data.
   * @param filters object to filter data Asset data.
   */
  loadAssetData(filters) {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        ...filters,
        {
          limit: this.limit,
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
          order: sharedConfig.defaultOrder,
        },
      ]),
    };
    this.$subscription.add(
      this._templateService
        .getAssets(this.entityId, config)
        .subscribe((response) => {
          if (
            this.tabFilterItems[this.tabFilterIdx].page > 0 &&
            this.tabFilterItems[this.tabFilterIdx].page > 0
          )
            this.assets = [...this.assets, ...response.records];
          else this.assets = response.records;
          this.tabFilterItems[this.tabFilterIdx].page += 1;
          response.entityTypeCounts &&
            this.updateTabFilterCount(response.entityTypeCounts);
        })
    );
  }

  /**
   * @function updateTabFilterCount To update the count for the tabs.
   * @param countObj The object with count for all the tab.
   * @param currentTabCount The count for current selected tab.
   */
  updateTabFilterCount(countObj): void {
    this.tabFilterItems.forEach((tab) => {
      tab.total = countObj[tab.value];
    });
  }

  loadSearchAsset(key) {
    this.assets = [];
  }

  /**
   * @function handleCopyToClipboard function to handle copy to clipboard action.
   */
  handleCopyToClipboard(event) {
    event.stopPropagation();
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: 'messages.success.urlCopied',
          priorityMessage: 'Asset url copied',
        },
        '',
        {
          panelClass: 'success',
        }
      )
      .subscribe();
  }

  /**
   * @function loadMoreAssetData function to load more Asset data.
   */
  loadMoreAssetData() {
    this.loadAssetData([
      {
        offset: this.tabFilterItems[this.tabFilterIdx].page * this.limit,
      },
    ]);
  }

  /**
   * @function close function to close imports.
   */
  close() {
    this.closeImport.emit();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
