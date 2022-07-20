import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { AddressConfigI } from 'libs/web-user/shared/src/lib/data-models/stayDetailsConfig.model';
import { DocumentDetailsService } from 'libs/web-user/shared/src/lib/services/document-details.service';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, OnChanges, OnDestroy {
  private $subscription: Subscription = new Subscription();
  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  addressForm: FormGroup;
  addressDetailsConfig: AddressConfigI;
  countries = [];

  constructor(
    protected fb: FormBuilder,
    protected _stayDetailService: StayDetailsService,
    protected _documentDetailService: DocumentDetailsService,
    protected _translateService: TranslateService,
    protected _snackBarService: SnackBarService
  ) {
    this.initAddressForm();
  }

  ngOnChanges() {
    this.setAddress();
  }

  ngOnInit(): void {
    this.getCountriesList();
  }

  /**
   * Initialize form
   */
  initAddressForm() {
    this.addressForm = this.fb.group({
      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      country: [''],
      postalCode: [''],
    });
  }

  getCountriesList() {
    this.$subscription.add(
      this._documentDetailService.getCountryList().subscribe(
        (countriesList) => {
          this.countries = countriesList.map((country) => {
            //@todo change key
            return {
              key: country.nationality,
              value: country.name,
              id: country.id,
              nationality: country.nationality,
            };
          });

          this.setFieldConfiguration();
          this.registerListeners();
        },
        ({ error }) => {
          this._translateService.get(error.code).subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        }
      )
    );
  }

  setFieldConfiguration() {
    this.addressDetailsConfig = this._stayDetailService.setFieldForAddress(
      this.countries
    );
  }

  setAddress() {
    if (this.reservationData) {
      this.addFGEvent.next({
        name: 'address',
        value: this.addressForm,
      });

      this.addressForm.patchValue({ address: this._stayDetailService.address });
    }
  }

  registerListeners() {
    this.listenForStayDetailDSchange();
  }

  listenForStayDetailDSchange() {
    this.$subscription.add(
      this._stayDetailService.stayDetailDS$.subscribe((value) => {
        this.addressForm.patchValue({
          address: this._stayDetailService.address,
        });
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
