import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ContactList, IContact } from '../../data-models/listing.model';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'hospitality-bot-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.scss'],
})
export class ImportContactComponent implements OnInit {
  @Output() onImportClosed = new EventEmitter();
  @Input() hotelId: string;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['csv'],
  };
  contacts: IContact[];
  fileName = '';
  $subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  close() {
    this.onImportClosed.emit({ status: false });
  }

  importContact(event) {
    let formData = new FormData();
    formData.append('file', event.file);
    this.$subscription.add(
      this._listingService.importContact(this.hotelId, formData).subscribe(
        (response) => {
          this.fileName = event.file.name;
          this.contacts = new ContactList().deserialize(response).records;
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  save() {
    this.onImportClosed.emit({ status: true, data: this.contacts });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
