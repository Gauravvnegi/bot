import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AdminUtilityService,
  ModuleNames,
} from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { ReceiversSearchItem } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';
import {
  IList,
  ListTable,
} from 'libs/admin/listing/src/lib/data-models/listing.model';
import { ListType, RecipientType } from '../../types/campaign.type';
import { RoutesConfigService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-to-dropdown',
  templateUrl: './to-dropdown.component.html',
  styleUrls: ['./to-dropdown.component.scss'],
})
export class ToDropdownComponent implements OnInit, OnDestroy {
  @Input() value: string;
  @Input() search = false;
  @Input() entityId: string;
  @Input() searchList: ReceiversSearchItem[];

  @Output() selectedList = new EventEmitter();
  @Output() closeDropdown = new EventEmitter();

  tabFilterIdx = 0;
  offset = 0;
  limit = 5;

  tabFilterItems = campaignConfig.dropDownTabFilter;
  subscribers = campaignConfig.subscribers;

  listings: { data: IList[]; totalRecords: number } = {
    data: [],
    totalRecords: 0,
  };

  $subscriptions = new Subscription();

  constructor(
    private _campaignService: CampaignService,
    private _adminUtilityService: AdminUtilityService,
    private _router: Router,
    private _emailService: EmailService,
    protected _translateService: TranslateService,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  /**
   * @function onSelectedTabFilterChange function to update listing on selected tab filter change.
   * @param event event object to get index.
   */
  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    if (this.listings?.data?.length === 0) this.loadSubscribers();
  }

  /**
   * @function loadSubscribers function to load subscribers.
   */
  loadSubscribers() {
    this.$subscriptions.add(
      this._emailService
        .getAllSubscriberGroup(this.entityId)
        .subscribe((response) => {
          this.subscribers = response;
        })
    );
  }

  /**
   * @function loadListings function to load listing data.
   */
  loadListings() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          limit: this.limit,
          entityState: campaignConfig.topicConfig.active,
          offset: this.offset,
        },
      ]),
    };
    this.$subscriptions.add(
      this._campaignService
        .getListings(this.entityId, config)
        .subscribe((response) => {
          const listingData = new ListTable().deserialize(response);
          this.listings = {
            data: listingData.records,
            totalRecords: listingData.total,
          };
          this.limit = this.limit + campaignConfig.rowsPerPage.rows;
        })
    );
  }

  /**
   * @function selectItem function to select list items.
   * @param type type of item.
   * @param list list content.
   */
  selectItem<TType extends RecipientType>(type: TType, list: ListType<TType>) {
    const selectedIds = this._campaignService.selectedRecipient.value;
    const idSet = new Set(selectedIds);
    idSet.add(list.id);
    this._campaignService.selectedRecipient.next(Array.from(idSet));
    this.selectedList.emit({ type, data: list });
  }

  checkIfSelected(itemId: string): boolean {
    const selectedIds = this._campaignService.selectedRecipient.value;
    return selectedIds.includes(itemId);
  }

  /**
   * @function redirect function to redirect to url
   * @param url particular url.
   */
  redirect(url: string) {
    this._router.navigate([url]);
  }

  createListing() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.LISTING,
      additionalPath: 'create-listing',
    });
  }

  /**
   * @function close function to close dropdown.
   * @param event event object to stop propagation.
   */
  close(event: PointerEvent) {
    event.stopPropagation();
    this.closeDropdown.emit(event);
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscriptions.unsubscribe();
  }
}
