import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ModalService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'hospitality-bot-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
})
export class CreateListingComponent implements OnInit {
  listFG: FormGroup;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  constructor(
    private _fb: FormBuilder,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService,
    private _modal: ModalService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.listFG = this._fb.group({
      name: ['', [Validators.required]],
      topic: ['', [Validators.required]],
      description: [''],
      contacts: [[]],
      active: [false],
    });
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId(this.globalQueries);
        this.getTopicList(this.hotelId);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getTopicList(hotelId) {
    this.$subscription.add(
      this.listingService.getAssetList(hotelId).subscribe((response) => {
        this.topicList = response;
      })
    );
  }
}
