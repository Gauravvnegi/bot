import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { ReceiversSearchItem } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';
import { EmailService } from '../../services/email.service';

@Component({
  selector: 'hospitality-bot-to-dropdown',
  templateUrl: './to-dropdown.component.html',
  styleUrls: ['./to-dropdown.component.scss'],
})
export class ToDropdownComponent implements OnInit, OnDestroy {
  @Input() value: string;
  @Input() search = false;
  @Input() hotelId: string;
  @Input() searchList: ReceiversSearchItem[];
  @Output() selectedList = new EventEmitter();
  @Output() closeDropdown = new EventEmitter();
  $subscriptions = new Subscription();
  tabFilterIdx = 0;
  tabFilterItems = campaignConfig.dropDownTabFilter;
  listings = campaignConfig.listings;
  subscribers = campaignConfig.subscribers;
  offset = 0;
  constructor(
    private _campaignService: CampaignService,
    private _adminUtilityService: AdminUtilityService,
    private _router: Router,
    private _emailService: EmailService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadSubscribers();
  }

  /**
   * @function onSelectedTabFilterChange function to update listing on selected tab filter change.
   * @param event event object to get index.
   */
  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    if (this.listings.data.length === 0) this.loadListings();
  }

  /**
   * @function loadSubscribers function to load subscribers.
   */
  loadSubscribers() {
    this.$subscriptions.add(
      this._emailService
        .getAllSubscriberGroup(this.hotelId)
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
          limit: campaignConfig.rowsPerPage.rows,
          entityState: campaignConfig.topicConfig.active,
          offset: this.offset,
        },
      ]),
    };
    this.$subscriptions.add(
      this._campaignService
        .getListings(this.hotelId, config)
        .subscribe((response) => {
          this.listings.data = [...this.listings.data, ...response.records];
          this.offset = this.offset + campaignConfig.rowsPerPage.rows;
          this.listings.totalRecords = response.total;
        })
    );
  }

  /**
   * @function selectItem function to select list items.
   * @param type type of item.
   * @param list list content.
   */
  selectItem(type: string, list) {
    this.selectedList.emit({ type, data: list });
  }

  /**
   * @function redirect function to redirect to url
   * @param url particular url.
   */
  redirect(url: string) {
    this._router.navigate([url]);
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
