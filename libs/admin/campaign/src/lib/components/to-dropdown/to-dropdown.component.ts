import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-to-dropdown',
  templateUrl: './to-dropdown.component.html',
  styleUrls: ['./to-dropdown.component.scss'],
})
export class ToDropdownComponent implements OnInit {
  @Input() value: string;
  @Input() search = false;
  @Input() hotelId: string;
  @Output() selectedList = new EventEmitter();
  $subscriptions = new Subscription();
  tabFilterItems = [
    {
      label: 'Subscribers Groups',
      value: 'SUBSCRIBERGROUP',
      chips: [],
    },
    {
      label: 'Listing',
      value: 'LISTING',
      chips: [],
    },
  ];
  tabFilterIdx = 0;
  listings = {
    data: [],
    totalRecords: 20,
  };
  offset = 0;
  constructor(
    private _campaignService: CampaignService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.loadListings();
  }

  onSelectedTabFilterChange(event) {
    this.tabFilterIdx = event.index;
  }

  loadListings() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          limit: 2,
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
          this.offset = this.offset + 2;
          // TO-DO: Remove it once api gets fixed
          if (response.total == 0)
            this.listings.totalRecords = this.listings.data.length;
        })
    );
  }

  selectItem(type, list) {
    this.selectedList.emit({ type, data: list });
  }
}
