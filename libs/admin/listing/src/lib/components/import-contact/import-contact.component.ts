import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { ListingService } from '../../services/listing.service';

@Component({
  selector: 'hospitality-bot-import-contact',
  templateUrl: './import-contact.component.html',
  styleUrls: ['./import-contact.component.scss'],
})
export class ImportContactComponent implements OnInit {
  @Output() onImportClosed = new EventEmitter();
  @Input() hotelId: string;
  contactFG: FormGroup;
  $subscription = new Subscription();
  constructor(
    private _fb: FormBuilder,
    private _listingService: ListingService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.contactFG = this._fb.group({
      file: ['', [Validators.required]],
    });
  }

  close() {
    this.onImportClosed.emit({ status: true });
  }

  importContact() {
    this.$subscription.add(
      this._listingService
        .importContact(this.hotelId, this.contactFG.getRawValue())
        .subscribe(
          (response) => {
            debugger;
          },
          ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
        )
    );
  }
}
