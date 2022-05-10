import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
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
export class ToDropdownComponent implements OnInit {
  @Input() value: string;
  @Input() search = false;
  @Input() hotelId: string;
  @Input() searchList: ReceiversSearchItem[];
  @Output() selectedList = new EventEmitter();
  $subscriptions = new Subscription();
  tabFilterItems = campaignConfig.datatable.dropDownTabFilters;
  tabFilterIdx = 0;
  listings = campaignConfig.listings;
  subscribers=campaignConfig.subscribers;
  offset = 0;
  constructor(
    private _campaignService: CampaignService,
    private _adminUtilityService: AdminUtilityService,
    private _router: Router,
    private _emailService: EmailService
  ) {}

  ngOnInit(): void {
    this.loadSubscribers();
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
    if (this.listings.data.length == 0) this.loadListings();
  }

  loadSubscribers() {
    this.$subscriptions.add(
      this._emailService
        .getAllSubscriberGroup(this.hotelId)
        .subscribe((response) => {
          this.subscribers = response;
        })
    );
  }

  loadListings() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          limit: 5,
          entityState: 'ACTIVE',
          offset: this.offset,
        },
      ]),
    };
    this.$subscriptions.add(
      this._campaignService
        .getListings(this.hotelId, config)
        .subscribe((response) => {
          this.listings.data = [...this.listings.data, ...response.records];
          this.offset = this.offset + 5;
          this.listings.totalRecords = response.total;
        })
    );
  }

  selectItem(type, list) {
    this.selectedList.emit({ type, data: list });
  }

  redirect(url) {
    this._router.navigate([url]);
  }

  ngOnDestroy() {
    this.$subscriptions.unsubscribe();
  }
}
