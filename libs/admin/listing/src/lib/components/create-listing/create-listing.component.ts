import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import { Topics } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';
import { TranslateService } from '@ngx-translate/core';
import { listingConfig } from '../../constants/listing';

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
  topicList: Option[] = [];
  isSaving = false;
  pageTitle = 'Create Listing';

  navRoutes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Listing', link: '/pages/library/listing' },
    { label: 'Create Listing', link: './' },
  ];

  constructor(
    private _fb: FormBuilder,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService,
    private _location: Location,
    private _listingService: ListingService,
    private snackbarService: SnackBarService,
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.hotelId = this.globalFilterService.hotelId;
        this.getTopicList(this.hotelId);
      })
    );
  }

  /**
   * @function getTopicList To get topic record list.
   * @param hotelId The hotel id for which getTopicList will be done.
   */
  getTopicList(hotelId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: listingConfig.list.entityState,
          limit: listingConfig.list.limit,
        },
      ]),
    };
    this.$subscription.add(
      this.listingService.getTopicList(hotelId, config).subscribe(
        (response) => {
          const data = new Topics()
            .deserialize(response)
            .records.map((item) => ({ label: item.name, value: item.id }));
          this.topicList = [...this.topicList, ...data];
        },
        ({ error }) => {
          this.snackbarService
            .openSnackBarWithTranslate(
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

  /**
   * @function createList To create a new listing record.
   */
  createList() {
    if (
      this.listFG.invalid ||
      this.listFG.get('marketingContacts').value.length === 0
    ) {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: `message.validation.INVALID_FORM`,
            priorityMessage: 'Invalid Form.',
          },
          ''
        )
        .subscribe();
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
        this.snackbarService
          .openSnackBarWithTranslate(
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
        this.snackbarService
          .openSnackBarWithTranslate(
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

  /**
   * @function updateContactList To update marketing contact field's value.
   * @param event The event for which update contact field action will be done.
   */
  updateContactList(event) {
    if (event.add) this.listFG.patchValue({ marketingContacts: event.data });
  }

  /**
   * @function redirectToTable To navigate back to the data table page.
   */
  redirectToTable() {
    this._location.back();
  }

  /**
   * @function ngOnDestroy To unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
