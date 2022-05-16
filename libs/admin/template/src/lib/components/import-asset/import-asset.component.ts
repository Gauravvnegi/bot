import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { TemplateService } from '../../services/template.service';
import { templateConfig } from '../../constants/template';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-import-asset',
  templateUrl: './import-asset.component.html',
  styleUrls: ['./import-asset.component.scss'],
})
export class ImportAssetComponent implements OnInit {
  @ViewChild('assetList') private myScrollContainer: ElementRef;
  @Output() closeImport = new EventEmitter();
  searchValue = false;
  hotelId: string;
  tabFilterItems = templateConfig.datatable.assetsTabFilterItems;
  tabFilterIdx = 0;
  limit = templateConfig.importAsset.limit;
  assets = [];
  $subscription = new Subscription();
  assetFG: FormGroup;
  constructor(
    private _adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _templateService: TemplateService,
    private _fb: FormBuilder,
    private _snackbarService: SnackBarService,
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
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
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
   * @function getHotelId To set the hotel id after extracting from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
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
        .getAssets(this.hotelId, config)
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

  /**
   * @function HostListener for scroll event.
   * @param event scroll event.
   */
  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (
      this.myScrollContainer &&
      this.myScrollContainer.nativeElement.offsetHeight +
        this.myScrollContainer.nativeElement.scrollTop ==
        this.myScrollContainer.nativeElement.scrollHeight - 1 &&
      this.assets.length < this.tabFilterItems[this.tabFilterIdx].total
    ) {
      this.loadAssetData([
        {
          offset: this.tabFilterItems[this.tabFilterIdx].page * this.limit,
        },
      ]);
    }
  }

  loadSearchAsset(key) {
    this.assets = [];
  }

  /**
   * @function handleCopyToClipboard function to handle copy to clipboard action.
   */
  handleCopyToClipboard(event) {
    event.stopPropagation();
    this._snackbarService
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
}
