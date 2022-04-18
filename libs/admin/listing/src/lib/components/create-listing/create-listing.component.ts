import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ListingService } from '../../services/listing.service';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { ImportContactComponent } from '../import-contact/import-contact.component';

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
  constructor(
    private _fb: FormBuilder,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService,
    private _modal: ModalService,
    private _location: Location,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService,
    private _router: Router
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
      description: [''],
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
    this.$subscription.add(
      this.listingService.getAssetList(hotelId).subscribe((response) => {
        this.topicList = response.records;
      })
    );
  }

  openImportContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '550';
    const importCompRef = this._modal.openDialog(
      ImportContactComponent,
      dialogConfig
    );

    importCompRef.componentInstance.hotelId = this.hotelId;
    importCompRef.componentInstance.onImportClosed.subscribe((response) => {
      if (response.status) {
        this.listFG.patchValue({ marketingContacts: response.data });
      }
      importCompRef.close();
    });
  }

  openAddContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const editContactCompRef = this._modal.openDialog(
      EditContactComponent,
      dialogConfig
    );

    editContactCompRef.componentInstance.onContactClosed.subscribe(
      (response) => {
        if (response.status) {
          this.listFG.patchValue({ marketingContacts: response.data });
        }
        editContactCompRef.close();
      }
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

    this._listingService.createList(this.hotelId, data).subscribe(
      (response) => {
        this._snackbarService.openSnackBarAsText(
          `${response.name} is created.`,
          '',
          { panelClass: 'success' }
        );
        this._router.navigate([`pages/library/listing/edit/${response.id}`]);
      },
      ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
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
