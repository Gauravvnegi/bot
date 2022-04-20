import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { IList, List, Topics } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';
import { EditContactComponent } from '../edit-contact/edit-contact.component';
import { ImportContactComponent } from '../import-contact/import-contact.component';

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
  loading = false;
  constructor(
    private _fb: FormBuilder,
    private listingService: ListingService,
    private globalFilterService: GlobalFilterService,
    private _modal: ModalService,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService,
    private activatedRoute: ActivatedRoute,
    private _location: Location
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
        this.getListingId();
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
      this.listingService.getTopicList(hotelId).subscribe(
        (response) => {
          this.topicList = new Topics().deserialize(response).records;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
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
        const reqData = [];
        response.data.forEach((item) => {
          const {
            firstName,
            lastName,
            salutation,
            companyName,
            mobile,
            email,
          } = item;
          reqData.push({
            firstName,
            lastName,
            salutation,
            companyName,
            mobile,
            email,
          });
        });
        this.$subscription.add(
          this._listingService
            .updateListContact(this.hotelId, this.listId, reqData)
            .subscribe(
              (response) => {
                this.getListDetails(this.listId);
              },
              ({ error }) =>
                this._snackbarService.openSnackBarAsText(error.message)
            )
        );
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
          this.$subscription.add(
            this._listingService
              .updateListContact(this.hotelId, this.listId, response.data)
              .subscribe(
                (response) => {
                  this.getListDetails(this.listId);
                },
                ({ error }) =>
                  this._snackbarService.openSnackBarAsText(error.message)
              )
          );
        }
        editContactCompRef.close();
      }
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

    this._listingService.updateList(this.hotelId, this.listId, data).subscribe(
      (response) => {
        this._snackbarService.openSnackBarAsText(
          `${response.name} is updated.`,
          '',
          { panelClass: 'success' }
        );
        this.listFG.patchValue(response);
      },
      ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
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
