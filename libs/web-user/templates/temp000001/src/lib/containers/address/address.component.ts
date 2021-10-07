import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AddressConfigI } from 'libs/web-user/shared/src/lib/data-models/stayDetailsConfig.model';
import { StayDetailsService } from 'libs/web-user/shared/src/lib/services/stay-details.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent implements OnInit, OnChanges {
  private $subscription: Subscription = new Subscription();
  @Input() parentForm: FormGroup;
  @Input() reservationData;

  @Output()
  addFGEvent = new EventEmitter();

  addressForm: FormGroup;
  addressDetailsConfig: AddressConfigI;

  constructor(
    protected fb: FormBuilder,
    protected _stayDetailService: StayDetailsService
  ) {
    this.initAddressForm();
  }

  ngOnChanges() {
    this.setAddress();
  }

  ngOnInit(): void {
    this.setFieldConfiguration();
    this.registerListeners();
  }

  /**
   * Initialize form
   */
  initAddressForm() {
    this.addressForm = this.fb.group({
      address: [''],
    });
  }

  setFieldConfiguration() {
    this.addressDetailsConfig = this._stayDetailService.setFieldForAddress();
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
