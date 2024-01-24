import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
import {
  Filter,
  ModuleNames,
} from '../../../../../../../../../../libs/admin/shared/src/index';
import { SnackBarService } from '../../../../../../../../../../libs/shared/material/src/index';
import { SubscriptionPlanService } from '../../services/subscription-plan.service';
import { TokenUpdateService } from '../../services/token-update.service';
import { layoutConfig } from '../../constants/layout';
import { FilterTabs } from '../../type/product';
import { TabFilterItems } from '../../constants/menu.contant';
import { CheckboxEvent } from 'libs/admin/shared/src/lib/components/form-component/checkbox/checkbox.component';

@Component({
  selector: 'admin-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnChanges, OnInit {
  readonly filterTabs = FilterTabs;
  @Input() initialFilterValue;
  @Output() onCloseFilter = new EventEmitter();
  @Output() onApplyFilter = new EventEmitter();
  @Output() onResetFilter = new EventEmitter();

  entityList = [];
  brandList = [];
  feedbackType;
  outlets = [{ name: 'All', id: 'ALL' }];
  hotelBasedToken = { key: null, value: null };
  selectedTab = this.filterTabs.PROPERTY;
  selectedTabIndex: number;
  tabFilterItems: Filter<string, string>[] = TabFilterItems;

  filterForm: FormGroup;
  isTokenLoading = false;

  constructor(
    private _fb: FormBuilder,
    private _hotelDetailService: HotelDetailService,
    private tokenUpdateService: TokenUpdateService,
    private snackbarService: SnackBarService,
    protected subscriptionService: SubscriptionPlanService
  ) {
    this.initFilterForm();
    //to handle initial case when all outlets are selected
    // this.updateOutletsValue(true);
  }

  closePopup() {
    this.onCloseFilter.emit();
  }

  initFilterForm() {
    this.filterForm = this._fb.group({
      property: this._fb.group({
        brandName: ['', [Validators.required]],
        entityName: ['', [Validators.required]],
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
        feedbackType: [layoutConfig.feedback.both],
      }),
      outlets: this._fb.group({}),
      isAllOutletSelected: [true], //to handel all outlet selection in entity tab filter
    });
  }

  ngOnChanges() {
    this.setInitialFilterValue();
  }

  setInitialFilterValue() {
    this.filterForm.patchValue(this.initialFilterValue);
  }

  get isDisabled() {
    return this.filterForm.get('property').invalid;
  }

  ngOnInit(): void {
    this.initLOV();
    this.registerListeners();
    this.setInitialFilterValue();
    this.initOptions();
  }

  registerListeners() {
    this.listenForBrandChanges();
    this.listenForBranchChanges();
  }

  initOptions() {
    this.tabFilterItems = this.tabFilterItems.filter((item) => {
      switch (item.value) {
        case this.filterTabs.OUTLETS:
          return this.checkForOutlets();
        default:
          return true;
      }
    });

    this.selectedTabIndex = this.tabFilterItems.findIndex(
      (item) => item.value == this.selectedTab
    );
  }

  listenForBrandChanges() {
    this.filterForm
      .get('property')
      .get('brandName')
      .valueChanges.subscribe((brandId) => {
        const { entities } = this._hotelDetailService.brands.find(
          (brand) => brand['id'] === brandId
        );

        this.brandList = entities
          .filter((item) => item.status === 'ACTIVE')
          .map((item) => ({
            label: item.name,
            value: item.id,
          }));

        const currentBranch = this.filterForm.get('property').get('entityName')
          .value;

        if (
          currentBranch &&
          this.brandList.findIndex((item) => item.value === currentBranch) ===
            -1
        ) {
          this.filterForm.get('property').patchValue({ entityName: '' }); //resetting hotel
        }
      });
  }

  listenForBranchChanges() {
    this.filterForm
      .get('property')
      .get('entityName')
      .valueChanges.subscribe((id) => {
        const brandName = this.filterForm.get('property').get('brandName')
          .value;
        const outlets =
          this._hotelDetailService.brands
            .find((item) => item.id == brandName)
            ?.entities.find((item) => item.id === id)
            .entities.filter((outlet) => outlet.status === 'ACTIVE') ?? [];
        this.outlets = [...this.outlets, ...outlets];
        this.updateOutletsFormControls(this.outlets);
        this.initOptions();
      });
  }

  updateOutletsFormControls(outlets) {
    let outletFG: FormGroup = this.filterForm.get('outlets') as FormGroup;
    if (Object.keys(outletFG.controls).length) outletFG = this._fb.group({});

    outlets.forEach((outlet) => {
      outletFG.addControl(
        outlet.id,
        new FormControl(
          this.feedbackFG.get('feedbackType').value ===
            layoutConfig.feedback.both
        )
      );
    });
  }

  updateOutletsValue(value: boolean) {
    Object.keys(this.outletFG.controls).forEach((id) => {
      this.outletFG.get(id).setValue(value);
    });
  }

  initLOV() {
    this.setBrandLOV();
  }

  setBrandLOV() {
    this.entityList = this._hotelDetailService.brands
      .filter((brand) => brand.status === 'ACTIVE')
      .map((item) => ({
        label: item.name,
        value: item.id,
      }));
  }

  applyFilter() {
    if (
      this.feedbackFG.get('feedbackType').value !== 'STAYFEEDBACK' &&
      !!this.outlets.length &&
      !Object.keys(this.outletFG.value)
        .map((key) => this.outletFG.value[key])
        .reduce((acc, red) => acc || red)
    ) {
      //when no outlet is selected then set the feedback type to stay and apply filter for hotel based token
      this.feedbackFG.get('feedbackType').setValue(layoutConfig.feedback.stay);

      this.onApplyFilter.next({
        values: this.filterForm.getRawValue(),
        token: this.hotelBasedToken,
      });

      return;
    }

    //when outlets are selected then set the feedback type to transactional
    this.onApplyFilter.next({
      values: this.filterForm.getRawValue(),
      token: this.hotelBasedToken,
    });
  }

  handleHotelChange(event) {
    this.isTokenLoading = true;

    this.tokenUpdateService.getUpdatedToken(event).subscribe(
      (response) => {
        const key = Object.keys(response)[0];
        this.hotelBasedToken = { key, value: response[key] };
      },
      ({ error }) => {
        this.snackbarService.openSnackBarAsText(error.message);
      },
      () => {
        this.isTokenLoading = false;
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

  /**
   * @function onOutletSelect
   * @description This function is used handle the outlet selection
   * @param event
   * @param outlet
   */
  onOutletSelect(event: CheckboxEvent, outlet) {
    //to handle the case when all outlets are selected
    this.feedbackFG.get('feedbackType').setValue(layoutConfig.feedback.both);

    if (outlet.id === 'ALL') {
      this.updateOutletsValue(event.checked);
      this.filterForm.get('isAllOutletSelected').setValue(event.checked);
    } else {
      const areAllOutletsSelected = Object.keys(this.outletFG.controls)
        .filter((item) => item !== 'ALL')
        .every((id) => this.outletFG.controls[id].value);

      this.filterForm
        .get('isAllOutletSelected')
        .setValue(areAllOutletsSelected);

      this.outletFG.get('ALL').setValue(areAllOutletsSelected);
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

  checkForOutlets() {
    return this.outlets.length - 1;
  }

  checkForStayFeedbackSubscribed() {
    return this.subscriptionService.checkModuleSubscription(
      ModuleNames.FEEDBACK
    );
  }

  onSelectedTabFilterChange(event: Record<'index', number>) {
    this.selectedTabIndex = event.index;
    this.selectedTab = this.tabFilterItems[this.selectedTabIndex]
      .value as FilterTabs;
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

  get brandNameFC() {
    return this.propertyFG.get('brandName') as FormControl;
  }

  get entityNameFC() {
    return this.propertyFG.get('entityName') as FormControl;
  }
}
