import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import { get } from 'lodash';
import { SnackBarService } from '../../../../../../../../../../libs/shared/material/src/index';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { TokenUpdateService } from '../../services/token-update.service';

@Component({
  selector: 'admin-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnChanges, OnInit {
  @Input() initialFilterValue;
  @Output() onCloseFilter = new EventEmitter();
  @Output() onApplyFilter = new EventEmitter();
  @Output() onResetFilter = new EventEmitter();

  hotelList = [];
  branchList = [];
  feedbackType;
  outlets = [];
  hotelBasedToken = { key: null, value: null };

  filterForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _hotelDetailService: HotelDetailService,
    private tokenUpdateService: TokenUpdateService,
    private snackbarService: SnackBarService,
    protected subscriptionService: SubscriptionPlanService
  ) {
    this.initFilterForm();
  }

  closePopup() {
    this.onCloseFilter.emit();
  }

  initFilterForm() {
    this.filterForm = this._fb.group({
      property: this._fb.group({
        hotelName: [],
        branchName: [''],
      }),
      guest: this._fb.group({
        guestCategory: this._fb.group({
          isRepeatedGuest: [''],
          isNewGuest: [''],
        }),
        guestType: this._fb.group({
          isVip: [''],
          isMembership: [''],
          isGeneral: [''],
        }),
      }),
      feedback: this._fb.group({
        feedbackType: [
          this.checkForTransactionFeedbackSubscribed()
            ? 'TRANSACTIONALFEEDBACK'
            : 'STAYFEEDBACK',
        ],
      }),
      outlets: this._fb.group({}),
    });
  }

  ngOnChanges() {
    this.setInitialFilterValue();
  }

  setInitialFilterValue() {
    this.filterForm.patchValue(this.initialFilterValue);
  }

  ngOnInit(): void {
    this.initLOV();
    this.registerListeners();
    this.setInitialFilterValue();
  }

  registerListeners() {
    this.listenForBrandChanges();
    this.listenForBranchChanges();
  }

  listenForBrandChanges() {
    this.filterForm
      .get('property')
      .get('hotelName')
      .valueChanges.subscribe((brandId) => {
        const { branches } = this.hotelList.find(
          (brand) => brand['value'] == brandId
        );

        this.branchList = branches;
      });
  }

  listenForBranchChanges() {
    this.filterForm
      .get('property')
      .get('branchName')
      .valueChanges.subscribe((id) => {
        const { outlets } = this.branchList.find(
          (branch) => branch['id'] == id
        );

        this.outlets = outlets;
        this.updateOutletsFormControls(outlets);
      });
  }

  updateOutletsFormControls(outlets) {
    let outletFG: FormGroup = this.filterForm.get('outlets') as FormGroup;
    if (Object.keys(outletFG.controls).length) outletFG = this._fb.group({});

    outlets.forEach((outlet) => {
      outletFG.addControl(
        outlet.id,
        new FormControl(
          this.feedbackFG.get('feedbackType').value === 'TRANSACTIONALFEEDBACK'
        )
      );
    });
  }

  updateOutletsValue(value) {
    Object.keys(this.outletFG.controls).forEach((id) => {
      this.outletFG.get(id).setValue(value);
    });
  }

  initLOV() {
    this.setBrandLOV();
  }

  setBrandLOV() {
    this.hotelList = this._hotelDetailService.hotelDetails.brands;
  }

  applyFilter() {
    this.onApplyFilter.next({
      values: this.filterForm.getRawValue(),
      token: this.hotelBasedToken,
    });
  }

  handleHotelChange(event) {
    this.tokenUpdateService.getUpdatedToken(event).subscribe(
      (response) => {
        const key = Object.keys(response)[0];
        this.hotelBasedToken = { key, value: response[key] };
      },
      ({ error }) => {
        this.snackbarService.openSnackBarAsText(error.message);
      }
    );
  }

  resetFilter() {
    const propertyValue = this.filterForm.get('property').value;
    const feedback = this.filterForm.get('feedback').value;
    const outlets = this.filterForm.get('outlets').value;
    Object.keys(outlets).forEach((key) => (outlets[key] = true));
    this.filterForm.reset({ property: propertyValue, feedback, outlets });
    this.onResetFilter.next(this.filterForm.getRawValue());
    this.hotelBasedToken = { key: null, value: null };
  }

  onOutletSelect(event) {
    if (
      event.checked &&
      this.feedbackFG.get('feedbackType').value !== 'TRANSACTIONALFEEDBACK'
    ) {
      this.feedbackFG.patchValue({ feedbackType: 'TRANSACTIONALFEEDBACK' });
    } else if (!this.checkForNoOutletSelected(this.outletFG.value)) {
      this.feedbackFG.patchValue({ feedbackType: 'STAYFEEDBACK' });
    }
  }

  checkForNoOutletSelected(outlets) {
    let returnValue = false;
    Object.keys(outlets).forEach((outlet) => {
      if (outlets[outlet]) returnValue = true;
    });
    return returnValue;
  }

  handleFeedbackTypeChange(event) {
    switch (event.value) {
      case 'TRANSACTIONALFEEDBACK':
        this.updateOutletsValue(true);
        break;
      case 'STAYFEEDBACK':
        this.updateOutletsValue(false);
        break;
      case 'ALL':
        this.updateOutletsValue(true);
        break;
    }
  }

  checkForTransactionFeedbackSubscribed() {
    const subscription = this.subscriptionService.getModuleSubscription();
    return get(subscription, ['modules', 'FEEDBACK_TRANSACTIONAL', 'active']);
  }

  checkForStayFeedbackSubscribed() {
    const subscription = this.subscriptionService.getModuleSubscription();
    return get(subscription, ['modules', 'feedback', 'active']);
  }

  get propertyFG() {
    return this.filterForm.get('property') as FormGroup;
  }

  get outletFG() {
    return this.filterForm.get('outlets') as FormGroup;
  }

  get feedbackFG() {
    return this.filterForm.get('feedback') as FormGroup;
  }

  get guestFG() {
    return this.filterForm.get('guest') as FormGroup;
  }

  get hotelNameFC() {
    return this.propertyFG.get('hotelName') as FormControl;
  }

  get branchNameFC() {
    return this.propertyFG.get('branchName') as FormControl;
  }
}
