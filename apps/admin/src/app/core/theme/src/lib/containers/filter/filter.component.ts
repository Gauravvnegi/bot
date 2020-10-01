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
  filterTypes = [
    {
      name: 'property',
      label: 'Property',
      disabled: false,
    },
    {
      name: 'guestType',
      label: 'Guest Type',
      disabled: false,
    },
  ];

  hotelList = [];

  branchList = [];

  filterForm: FormGroup;

  constructor(
    private _fb: FormBuilder,
    private _hotelDetailService: HotelDetailService
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
    this.initialFilterValue && this.setInitialFilterValue();
  }

  setInitialFilterValue() {
    this.filterForm.patchValue(this.initialFilterValue);
  }

  ngOnInit(): void {
    this.initLOV();
    this.registerListeners();
    this.initialFilterValue = {
      property: {
        hotelName: this._hotelDetailService.hotelDetails.brands[0].id,
      },
    };
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
        this.filterForm
          .get('property')
          .get('branchName')
          .patchValue(this.branchList[0].id);
      });
  }

  initLOV() {
    this.setBrandLOV();
  }

  setBrandLOV() {
    this.hotelList = this._hotelDetailService.hotelDetails.brands;
  }

  applyFilter() {
    this.onApplyFilter.next(this.filterForm.getRawValue());
  }

  resetFilter() {
    this.filterForm.reset();
    this.onResetFilter.next(this.filterForm.getRawValue());
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
