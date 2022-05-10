import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { IList, List } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'hospitality-bot-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.scss'],
})
export class EditListingComponent implements OnInit {
  listFG: FormGroup;
  listData: IList;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  listId: string;
  isSaving = false;
  loading = false;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private _router: Router
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.listFG = this._fb.group({
      id: [''],
      name: ['', [Validators.required]],
      topicName: [''],
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
        this.getListingId();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getListingId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.listId = params['id'];
          this.getListDetails(this.listId);
        }
      })
    );
  }

  getListDetails(id) {
    this.loading = true;
    this.$subscription.add(
      this._listingService.getListById(this.hotelId, id).subscribe(
        (response) => {
          this.loading = false;
          this.listData = new List().deserialize(response, 0);
          this.listFG.patchValue(this.listData);
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  updateList() {
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
    this._listingService.updateList(this.hotelId, this.listId, data).subscribe(
      (response) => {
        this._snackbarService.openSnackBarAsText(
          `${response.name} is updated.`,
          '',
          { panelClass: 'success' }
        );
        this._router.navigate([`pages/library/listing`]);
      },
      ({ error }) => this._snackbarService.openSnackBarAsText(error.message),
      () => (this.isSaving = false)
    );
  }

  updateContactList(event) {
    this.getListDetails(this.listId);
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
