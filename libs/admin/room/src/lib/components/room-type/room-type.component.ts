import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { IpackageOptions } from 'libs/admin/packages/src/lib/data-models/packageConfig.model';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
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
  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalService: GlobalFilterService,
    private configService: ConfigService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService
  ) {}

  selectProperty: any = 'id';
  extraProperty: string[] = ['name'];
  subscription$ = new Subscription();
  paidAmenities: Amenity[];
  compAmenities: Amenity[];
  amenities: Amenities;
  currency: IpackageOptions[];
  discount: IpackageOptions[];

  originalPrice: number;
  discountTypeValue: number;
  discountedPrice: number;
  discountType: string;
  maxOccupancy: number;
  maxAdult: number;

  dateTimeValue: number = 1238544816452;
  addRoomTypeForm: FormGroup;
  isSavingDetails: boolean = false;
  isUpdatingDetails: boolean = false;
  mode: 'Save' | 'Update' = 'Save';
  roomTypeId: string;
  hotelId: string;
  paidSelectedLabel: string[] = ['name', 'rate'];
  compSelectedLabel: string[] = ['name'];

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.activatedRoute.queryParams.subscribe((res) => {
      this.roomTypeId = res.id;
      this.roomTypeId ? (this.mode = 'Update') : 'Save';
    });
    this.initAddRoomTypeForm();
    this.getAmenities();
    this.getConfigByHotelID();
    if (this.roomTypeId) this.getRoomTypeById();
  }

  initAddRoomTypeForm() {
    this.addRoomTypeForm = this.fb.group({
      name: ['', [Validators.required]],
      imageUrls: [[], []],
      description: ['', [Validators.required]],
      complimentaryAmenities: [[], [Validators.required]],
      paidAmenities: [[], [Validators.required]],
      originalPrice: ['', [Validators.required]],
      discountType: ['', []],
      discountTypeValue: ['', []],
      discountedPrice: ['', []],
      variablePriceCurrency: ['', []],
      currency: ['', []],
      variablePrice: ['', []],
      discountedPriceCurrency: ['', []],
      maxOccupancy: ['', [Validators.required]],
      maxChildren: ['', []],
      maxAdult: ['', []],
      area: ['', [Validators.required]],
    });

    this.disableControls();
    this.addRoomTypeForm.controls['originalPrice'].valueChanges.subscribe(
      (res) => {
        this.originalPrice = res;
        this.onBasePriceChange();
      }
    );

    this.addRoomTypeForm.controls['discountType'].valueChanges.subscribe(
      (res) => {
        this.discountType = res;
        this.onDiscountTypeChange();
      }
    );

    this.addRoomTypeForm.controls['discountTypeValue'].valueChanges.subscribe(
      (res) => {
        this.discountTypeValue = res;
        this.OnDiscountValueChange();
      }
    );

    this.addRoomTypeForm.controls['currency'].valueChanges.subscribe((res) => {
      this.addRoomTypeForm.controls['discountedPriceCurrency'].setValue(res);
      this.addRoomTypeForm.controls['variablePriceCurrency'].setValue(res);
    });
    this.onMaxOccupancyChange();
    this.onMaxAdultChange();
  }

  getAmenities() {
    this.subscription$.add(
      this.roomService
        .getAmenities(this.hotelId)
        .pipe(map((x) => x.records.filter((x) => x.active == true)))
        .subscribe(
          (res) => {
            this.amenities = new Amenities().deserialize(res);
            this.paidAmenities = this.amenities.paidAmenities;
            this.compAmenities = this.amenities.compAmenities;
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
          }
        )
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
    if (this.addRoomTypeForm.valid) {
      debugger;
      const data = this.deserializeFormValue(
        this.addRoomTypeForm.getRawValue()
      );
      this.subscription$.add(
        this.roomService.createRoomType(this.hotelId, data).subscribe(
          (res) => {
            this.isSavingDetails = false;
            this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
            this.snackbarService.openSnackBarAsText(
              'Room type is created successfully',
              '',
              { panelClass: 'success' }
            );
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
            this.isSavingDetails = false;
          }
        )
      );
    } else {
      this.isSavingDetails = false;
      this.snackbarService.openSnackBarAsText('Invalid Form');
      this.addRoomTypeForm.markAllAsTouched();
      return;
    }
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
    this.setDiscountedPrice(this.discountType);
  }

  onDiscountTypeChange() {
    this.addRoomTypeForm.controls['discountTypeValue'].setValue(null);
    if (this.discountType == this.discount[1].value) {
      this.addRoomTypeForm.controls['discountTypeValue'].clearValidators();
      this.addRoomTypeForm.controls[
        'discountTypeValue'
      ].updateValueAndValidity();
      this.setDiscountedPrice(this.discountType);
    } else {
      this.addRoomTypeForm.controls['discountTypeValue'].setValidators([
        Validators.max(100),
      ]);
      this.addRoomTypeForm.controls['discountTypeValue'].markAsTouched();
      this.setDiscountedPrice(this.discountType);
    }
  }

  OnDiscountValueChange() {
    if (this.discountType == this.discount[1].value) {
      if (this.originalPrice >= this.discountTypeValue) {
        this.setDiscountedPrice(this.discountType);
      } else {
        this.addRoomTypeForm.controls['discountTypeValue'].setErrors({
          incorrect: true,
        });
      }
    } else {
      this.setDiscountedPrice(this.discountType);
    }
  }

  setDiscountedPrice(discountType: string) {
    if (discountType == this.discount[0].value) {
      this.discountedPrice =
        this.originalPrice -
        (this.originalPrice * this.discountTypeValue) / 100;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
    } else if (discountType == this.discount[1].value) {
      this.discountedPrice = this.originalPrice - this.discountTypeValue;
      this.addRoomTypeForm.controls['discountedPrice'].setValue(
        this.discountedPrice
      );
    }
  }

  onMaxOccupancyChange() {
    this.addRoomTypeForm.controls['maxOccupancy'].valueChanges.subscribe(
      (res) => {
        this.maxOccupancy = res;
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
    this.addRoomTypeForm.controls['maxAdult'].valueChanges.subscribe((res) => {
      if (this.maxOccupancy >= res) {
        const maxChildren = this.maxOccupancy - res;
        this.addRoomTypeForm.controls['maxChildren'].setValue(maxChildren);
      } else {
        this.addRoomTypeForm.controls['maxAdult'].setErrors({
          incorrect: true,
        });
      }
    });
  }

  getRoomTypeById() {
    this.roomService.getRoomTypeById(this.hotelId, this.roomTypeId).subscribe(
      (res) => {
        this.addRoomTypeForm.patchValue(res);
      },
      (err) => {
        this.snackbarService.openSnackBarAsText(err.error.message);
      }
    );
  }

  updateDetails() {
    this.isUpdatingDetails = true;
    if (this.addRoomTypeForm.valid) {
      const formValue = this.addRoomTypeForm.getRawValue();
      const data = {
        ...this.deserializeFormValue(formValue),
        id: this.roomTypeId,
      };
      this.subscription$.add(
        this.roomService.updateRoomType(this.hotelId, data).subscribe(
          (res) => {
            this.isUpdatingDetails = false;
            this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
            this.snackbarService.openSnackBarAsText(
              'Room type is updated successfully',
              '',
              { panelClass: 'success' }
            );
          },
          (error) => {
            this.isUpdatingDetails = false;
            this.snackbarService.openSnackBarAsText(error.error.message);
          }
        )
      );
    } else {
      this.isUpdatingDetails = false;
      this.snackbarService.openSnackBarAsText('Invalid Form');
      this.addRoomTypeForm.markAllAsTouched();
      return;
    }
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
      variableAmount: formValue.variablePrice,
      discountType: formValue.discountType,
      discountValue: formValue.discountTypeValue,
    };

    return data;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
