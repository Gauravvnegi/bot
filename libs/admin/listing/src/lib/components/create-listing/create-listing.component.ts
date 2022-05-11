import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Topics } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-create-listing',
  templateUrl: './create-listing.component.html',
  styleUrls: ['./create-listing.component.scss'],
})
export class CreateListingComponent implements OnInit, OnDestroy {
  listFG: FormGroup;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  isSaving = false;
  constructor(
    private _fb: FormBuilder,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService,
    private _location: Location,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService,
    private _router: Router,
    protected _translateService: TranslateService,
    private adminUtilityService: AdminUtilityService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.listFG = this._fb.group({
      name: ['', [Validators.required]],
      topicName: ['', [Validators.required]],
      description: ['', [Validators.required]],
      marketingContacts: [[]],
      active: [true],
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
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: 'ACTIVE', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.listingService.getTopicList(hotelId, config).subscribe(
        (response) =>
          (this.topicList = new Topics().deserialize(response).records),
        ({ error }) => {
          this._snackbarService.openSnackBarWithTranslate(
            {
              translateKey: 'message.error.topicList_fail',
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
        }
      )
    );
  }

  createList() {
    if (
      this.listFG.invalid ||
      this.listFG.get('marketingContacts').value.length === 0
    ) {
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    const data = this.listFG.getRawValue();
    data.marketingContacts = data.marketingContacts.map((contact) => {
      const {
        firstName,
        lastName,
        salutation,
        companyName,
        mobile,
        email,
      } = contact;
      return {
        firstName,
        lastName,
        salutation,
        companyName,
        mobile,
        email,
      };
    });
    this.isSaving = true;
    this._listingService.createList(this.hotelId, data).subscribe(
      (response) => {
        this._snackbarService.openSnackBarWithTranslate(
          {
            translateKey: 'message.success.listing_created',
            priorityMessage: `${response.name} is Created.`,
          },
          '',
          {
            panelClass: 'success',
          }
        )
        .subscribe();
        this._router.navigate([`pages/library/listing`]);
      },
      ({ error }) => {
        this._snackbarService.openSnackBarWithTranslate(
          {
            translateKey: 'message.error.listing_not_created',
            priorityMessage: error.message,
          },
          ''
        )
        .subscribe();
      },
      () => (this.isSaving = false)
    );
  }

  updateContactList(event) {
    if (event.add) {
      this.listFG.patchValue({ marketingContacts: event.data });
    }
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
