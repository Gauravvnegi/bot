import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  OnChanges,
} from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { FilterService } from '../../services/filter.service';
import { HotelDetailService } from 'libs/admin/shared/src/lib/services/hotel-detail.service';
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
  hotelBasedToken = { key: null, value: null };

  filterForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _hotelDetailService: HotelDetailService,
    private tokenUpdateService: TokenUpdateService
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
    // this.initialFilterValue = {
    //   property: {
    //     hotelName: this._hotelDetailService.hotelDetails.brands[0].id,
    //     branchName: this._hotelDetailService.hotelDetails.brands[0].branches[0]
    //       .id,
    //   },
    // };
    this.setInitialFilterValue();
  }

  registerListeners() {
    this.listenForBrandChanges();
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
        // this.filterForm
        //   .get('property')
        //   .get('branchName')
        //   .patchValue(this.branchList[0].id);
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
        console.log(error.message);
      }
    );
  }

  resetFilter() {
    const propertyValue = this.filterForm.get('property').value;
    this.filterForm.reset({ property: propertyValue });
    this.onResetFilter.next(this.filterForm.getRawValue());
    this.hotelBasedToken = { key: null, value: null };
  }

  get propertyFG() {
    return this.filterForm.get('property') as FormGroup;
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
