import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ModalService } from '@hospitality-bot/shared/material';
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
    private _location: Location
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
        this.topicList = response;
      })
    );
  }

  openImportContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '550';
    const detailCompRef = this._modal.openDialog(
      ImportContactComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.onImportClosed.subscribe((response) => {
      if (response.status) {
        console.log('Import done.');
        detailCompRef.close();
      }
    });
  }

  openAddContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const detailCompRef = this._modal.openDialog(
      EditContactComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.onContactClosed.subscribe((response) => {
      if (response.status) {
        this.listFG.patchValue({ contacts: response.data });
      }
      detailCompRef.close();
    });
  }

  goBack() {
    this._location.back();
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
