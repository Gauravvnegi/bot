import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { IpackageOptions } from 'libs/admin/packages/src/lib/data-models/packageConfig.model';
import { PackageService } from 'libs/admin/packages/src/lib/services/package.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import routes from '../../config/routes';
import { Amenities, Amenity } from '../../models/amenities.model';
import { RoomService } from '../../services/room.service';
@Component({
  selector: 'hospitality-bot-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss'],
})
export class RoomTypeComponent implements OnInit, OnDestroy {
  roomTypeId: string;

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalService: GlobalFilterService,
    private configService: ConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.queryParams.subscribe((res) => {
      this.roomTypeId = res.id;
      this.roomTypeId ? (this.mode = 'Update') : 'Save';
    });
  }

  selectProperty: any = 'id';
  extraProperty: string[] = ['name'];
  subscription$ = new Subscription();
  paidAmenities: Amenity[];
  compAmenities: Amenity[];
  amenities: Amenities;
  currency: IpackageOptions[];
  discount: IpackageOptions[];
  hotelId: string;

  originalPrice: number;
  discountTypeValue: number;
  discountedPrice: number = 0;
  discountType: string;
  maxOccupancy: number;
  maxAdult: number;

  dateTimeValue: number = 1238544816452;
  addRoomTypeForm: FormGroup;
  isSavingDetails: boolean = false;
  isUpdatingDetails: boolean = false;
  mode: 'Save' | 'Update' = 'Save';

  ngOnInit(): void {
    this.initAddRoomTypeForm();
    this.getAmenities();
    this.getConfigByHotelID();
    if (this.roomTypeId) this.getRoomTypeById();
  }

  initAddRoomTypeForm() {
    this.addRoomTypeForm = this.fb.group({
      name: ['', []],
      imageUrls: [[], []],
      description: ['', [Validators.required]],
      complimentaryAmenities: [[], []],
      paidAmenities: [[], []],
      originalPrice: ['', []],
      discountType: ['', []],
      discountTypeValue: ['', []],
      discountedPrice: ['', []],
      variablePriceCurrency: ['', []],
      currency: ['', []],
      variablePrice: ['', []],
      discountedPriceCurrency: ['', []],
      maxOccupancy: ['', []],
      maxChildren: ['', []],
      maxAdult: ['', []],
      variableCost: ['', []],
      area: ['', []],
    });

    this.disableControls();
    this.addRoomTypeForm.controls['originalPrice'].valueChanges.subscribe(
      (x) => {
        this.originalPrice = x;
        this.onBasePriceChange();
      }
    );

    this.addRoomTypeForm.controls['discountType'].valueChanges.subscribe(
      (x) => {
        this.discountType = x;
        this.onDiscountTypeChange();
      }
    );

    this.addRoomTypeForm.controls['discountTypeValue'].valueChanges.subscribe(
      (x) => {
        this.discountTypeValue = x;
        this.OnDiscountValueChange();
      }
    );

    this.addRoomTypeForm.controls['currency'].valueChanges.subscribe((x) => {
      this.addRoomTypeForm.controls['discountedPriceCurrency'].setValue(x);
      this.addRoomTypeForm.controls['variablePriceCurrency'].setValue(x);
    });
    this.onMaxOccupancyChange();
    this.onMaxAdultChange();
  }

  getAmenities() {
    this.hotelId = this.globalService.hotelId;
    this.subscription$.add(
      this.roomService
        .getAmenities(this.hotelId)
        .pipe(map((x) => x.records.filter((x) => x.active == true)))
        .subscribe((res: any[]) => {
          this.amenities = new Amenities().deserialize(res);
          this.paidAmenities = this.amenities.paidAmenities;
          this.compAmenities = this.amenities.compAmenities;
        })
    );
  }

  getConfigByHotelID() {
    this.subscription$.add(
      this.configService
        .getColorAndIconConfig(this.hotelId)
        .subscribe((response) => {
          this.setCurrencyOptions(response.currencyConfiguration);
          this.setDiscountOptions(response.roomDiscountConfig);
        })
    );
  }

  setCurrencyOptions(data) {
    this.currency = new Array<IpackageOptions>();
    data.forEach((d) => this.currency.push({ key: d.key, value: d.value }));
    this.addRoomTypeForm.controls['currency'].setValue(this.currency[0].value);
    this.addRoomTypeForm.controls['discountedPriceCurrency'].setValue(
      this.currency[0].value
    );
    this.addRoomTypeForm.controls['variablePriceCurrency'].setValue(
      this.currency[0].value
    );
  }

  setDiscountOptions(data) {
    this.discount = new Array<IpackageOptions>();
    data.forEach((d) =>
      this.discount.push({
        key: d.key,
        value: d.value,
      })
    );
    this.addRoomTypeForm.controls['discountType'].setValue(
      this.discount[0].value
    );
    this.addRoomTypeForm.controls['discountedPrice'].setValue(null);
  }

  saveDetails() {
    this.isSavingDetails = true;
    const formValue = this.addRoomTypeForm.getRawValue();
    const data = this.deserializeFormValue(formValue);

    this.subscription$.add(
      this.roomService.createRoomType(this.hotelId, data).subscribe(
        (x) => {
          this.isSavingDetails = false;
          this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
        },
        (error) => {
          this.isSavingDetails = false;
        }
      )
    );
  }

  disableControls() {
    this.addRoomTypeForm.controls['discountType'].disable();
    this.addRoomTypeForm.controls['discountTypeValue'].disable();
    this.addRoomTypeForm.controls['discountedPriceCurrency'].disable();
    this.addRoomTypeForm.controls['discountedPrice'].disable();
    this.addRoomTypeForm.controls['maxChildren'].disable();
    this.addRoomTypeForm.controls['maxAdult'].disable();
  }

  onBasePriceChange() {
    this.addRoomTypeForm.controls['discountType'].enable();
    this.addRoomTypeForm.controls['discountTypeValue'].enable();
    this.addRoomTypeForm.controls['discountTypeValue'].setValue(null);
    if (this.discountType == 'Number') {
      this.discountedPrice = this.originalPrice - this.discountTypeValue;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
      this.addRoomTypeForm.controls['discountedPrice'].setValue(null);
    } else {
      this.discountedPrice =
        this.originalPrice -
        (this.originalPrice * this.discountTypeValue) / 100;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
    }
  }

  onDiscountTypeChange() {
    this.addRoomTypeForm.controls['discountTypeValue'].setValue(null);
    if (this.discountType == 'Number') {
      this.addRoomTypeForm.controls['discountTypeValue'].clearValidators();
      this.addRoomTypeForm.controls[
        'discountTypeValue'
      ].updateValueAndValidity();
      this.discountedPrice = this.originalPrice - this.discountTypeValue;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
    } else {
      this.addRoomTypeForm.controls['discountTypeValue'].setValidators([
        Validators.max(100),
      ]);
      this.addRoomTypeForm.controls['discountTypeValue'].markAsTouched();
      this.discountedPrice =
        this.originalPrice -
        (this.originalPrice * this.discountTypeValue) / 100;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
    }
  }

  OnDiscountValueChange() {
    if (this.discountType == 'Number') {
      if (this.originalPrice >= this.discountTypeValue) {
        this.discountedPrice = this.originalPrice - this.discountTypeValue;
        this.addRoomTypeForm.controls['discountedPrice'].setValue(
          this.discountedPrice
        );
      } else {
        this.addRoomTypeForm.controls['discountTypeValue'].setErrors({
          incorrect: true,
        });
      }
    } else {
      this.discountedPrice =
        this.originalPrice -
        (this.originalPrice * this.discountTypeValue) / 100;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
    }
  }

  onMaxOccupancyChange() {
    this.addRoomTypeForm.controls['maxOccupancy'].valueChanges.subscribe(
      (x) => {
        this.maxOccupancy = x;
        this.addRoomTypeForm.controls['maxAdult'].enable();
        this.addRoomTypeForm.controls['maxChildren'].patchValue(null);
        this.addRoomTypeForm.patchValue(
          { maxAdult: null },
          { emitEvent: false }
        );
      }
    );
  }

  onMaxAdultChange() {
    this.addRoomTypeForm.controls['maxAdult'].valueChanges.subscribe((x) => {
      if (this.maxOccupancy >= x) {
        const maxChildren = this.maxOccupancy - x;
        this.addRoomTypeForm.controls['maxChildren'].setValue(maxChildren);
      } else {
        this.addRoomTypeForm.controls['maxAdult'].setErrors({
          incorrect: true,
        });
      }
    });
  }

  getRoomTypeById() {
    this.roomService
      .getRoomTypeById(this.hotelId, this.roomTypeId)
      .subscribe((x) => {
        this.addRoomTypeForm.patchValue(x);
      });
  }

  updateDetails() {
    this.isUpdatingDetails = true;
    const formValue = this.addRoomTypeForm.getRawValue();
    const data = {
      ...this.deserializeFormValue(formValue),
      id: this.roomTypeId,
    };
    this.subscription$.add(
      this.roomService
        .updateRoomType(this.hotelId, this.roomTypeId, data)
        .subscribe(
          (x) => {
            this.isUpdatingDetails = false;
            this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
          },
          (error) => {
            this.isUpdatingDetails = false;
          }
        )
    );
  }

  deserializeFormValue(formValue: any) {
    const data = {
      name: formValue.name,
      imageUrls: formValue.imageUrls,
      roomAmenityIds: formValue.complimentaryAmenities.concat(
        formValue.paidAmenities
      ),
      description: formValue.description,
      currency: formValue.currency,
      originalPrice: formValue.originalPrice,
      discountedPrice: formValue.discountedPrice,
      maxOccupancy: formValue.maxOccupancy,
      maxAdult: formValue.maxAdult,
      maxChildren: formValue.maxChildren,
      area: formValue.area,
      status: true,
    };

    return data;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
