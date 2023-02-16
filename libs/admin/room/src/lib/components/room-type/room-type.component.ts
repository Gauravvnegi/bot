import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
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
  dateTimeValue: number = 1238544816452;
  useForm: FormGroup;
  loader: boolean = false;
  roomTypeId: string;
  hotelId: string;
  paidSelectedLabel: string[] = ['name', 'rate'];
  compSelectedLabel: string[] = ['name'];

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.activatedRoute.queryParams.subscribe((res) => {
      this.roomTypeId = res.id;
    });
    this.initAddRoomTypeForm();
    this.getConfigByHotelID();
    this.getAmenities();
  }
  initAddRoomTypeForm() {
    this.useForm = this.fb.group({
      name: ['', [Validators.required]],
      imageUrls: [[], []],
      description: ['', [Validators.required]],
      complimentaryAmenities: [[], []],
      paidAmenities: [[], [Validators.required]],
      originalPrice: ['', [Validators.required]],
      discountType: ['', []],
      discountValue: ['', []],
      discountedPrice: ['', []],
      variablePriceCurrency: ['', []],
      currency: ['', []],
      variableAmount: ['', []],
      discountedPriceCurrency: ['', []],
      maxOccupancy: ['', [Validators.required]],
      maxChildren: ['', []],
      maxAdult: ['', []],
      area: ['', [Validators.required]],
    });
    this.disableControls();
  }

  attachUseFormListener() {
    this.useForm.controls['originalPrice'].valueChanges.subscribe((res) => {
      this.onBasePriceChange();
    });

    this.useForm.controls['discountType'].valueChanges.subscribe((res) => {
      this.onDiscountTypeChange();
    });

    this.useForm.controls['discountValue'].valueChanges.subscribe((res) => {
      this.OnDiscountValueChange();
    });

    this.useForm.controls['currency'].valueChanges.subscribe((res) => {
      this.useForm.controls['discountedPriceCurrency'].setValue(res);
      this.useForm.controls['variablePriceCurrency'].setValue(res);
    });

    this.useForm.controls['maxOccupancy'].valueChanges.subscribe(
      (res: number) => {
        this.onMaxOccupancyChange(res);
      }
    );

    this.useForm.controls['maxAdult'].valueChanges.subscribe((res) => {
      this.onMaxAdultChange(res);
    });

    if (this.roomTypeId) this.getRoomTypeById();
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
          this.attachUseFormListener();
          this.setCurrencyOptions(response.currencyConfiguration);
          this.setDiscountOptions(response.roomDiscountConfig);
        })
    );
  }

  setCurrencyOptions(data) {
    this.currency = new Array<IpackageOptions>();
    data.forEach((d) => this.currency.push({ key: d.key, value: d.value }));
    this.useForm.controls['currency'].setValue(this.currency[0].value);
    this.useForm.controls['discountedPriceCurrency'].setValue(
      this.currency[0].value
    );
    this.useForm.controls['variablePriceCurrency'].setValue(
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
    this.useForm.controls['discountType'].setValue(this.discount[0].value);
    this.useForm.controls['discountedPrice'].setValue(null);
  }

  saveDetails() {
    this.loader = true;
    if (this.useForm.valid) {
      const data = this.setFormValue();
      this.subscription$.add(
        this.roomService.createRoomType(this.hotelId, data).subscribe(
          (res) => {
            this.loader = false;
            this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
            this.snackbarService.openSnackBarAsText(
              'Room type is created successfully',
              '',
              { panelClass: 'success' }
            );
          },
          (error) => {
            this.snackbarService.openSnackBarAsText(error.error.message);
            this.loader = false;
          }
        )
      );
    } else {
      this.loader = false;
      this.snackbarService.openSnackBarAsText('Invalid Form');
      this.useForm.markAllAsTouched();
      return;
    }
  }

  disableControls() {
    this.useForm.controls['discountType'].disable();
    this.useForm.controls['discountValue'].disable();
    this.useForm.controls['discountedPriceCurrency'].disable();
    this.useForm.controls['discountedPrice'].disable();
    this.useForm.controls['maxChildren'].disable();
    this.useForm.controls['maxAdult'].disable();
  }

  onBasePriceChange() {
    this.useForm.controls['discountType'].enable();
    this.useForm.controls['discountValue'].enable();
    this.useForm.controls['discountValue'].setValue(null);
    this.setDiscountedPrice(this.getControlValue('discountType'));
  }

  onDiscountTypeChange() {
    this.useForm.controls['discountValue'].setValue(null);
    if (this.getControlValue('discountType') == this.discount[1].value) {
      this.useForm.controls['discountValue'].clearValidators();
      this.useForm.controls['discountValue'].updateValueAndValidity();
      this.setDiscountedPrice(this.getControlValue('discountType'));
    } else {
      this.useForm.controls['discountValue'].setValidators([
        Validators.max(100),
      ]);
      this.useForm.controls['discountValue'].markAsTouched();
      this.setDiscountedPrice(this.getControlValue('discountType'));
    }
  }

  OnDiscountValueChange() {
    if (this.getControlValue('discountType') == this.discount[1].value) {
      if (
        this.getControlValue('originalPrice') >=
        this.getControlValue('discountValue')
      ) {
        this.setDiscountedPrice(this.getControlValue('discountType'));
      } else {
        this.useForm.controls['discountValue'].setErrors({
          incorrect: true,
        });
      }
    } else {
      this.setDiscountedPrice(this.getControlValue('discountType'));
    }
  }

  setDiscountedPrice(discountType: string) {
    let discountedPrice: number;
    if (discountType == this.discount[0].value) {
      discountedPrice =
        this.getControlValue('originalPrice') -
        (this.getControlValue('originalPrice') *
          this.getControlValue('discountValue')) /
          100;
      this.useForm.controls['discountedPrice'].setValue(discountedPrice);
    } else if (discountType == this.discount[1].value) {
      discountedPrice =
        this.getControlValue('originalPrice') -
        this.getControlValue('discountValue');
      this.useForm.controls['discountedPrice'].setValue(discountedPrice);
    }
  }

  onMaxOccupancyChange(maxOccupancy: number) {
    this.useForm.controls['maxAdult'].enable();
    this.useForm.controls['maxChildren'].patchValue(null);
    this.useForm.patchValue({ maxAdult: null }, { emitEvent: false });
    if (maxOccupancy != null && maxOccupancy <= 0) {
      this.useForm.controls['maxOccupancy'].setErrors({ incorrect: true });
      this.useForm.controls['maxOccupancy'].markAsTouched();
    }
  }

  onMaxAdultChange(maxAdult: number) {
    if (!(maxAdult <= 0) && this.getControlValue('maxOccupancy') >= maxAdult) {
      const maxChildren = this.getControlValue('maxOccupancy') - maxAdult;
      this.useForm.controls['maxChildren'].setValue(maxChildren);
    } else if (maxAdult != null) {
      this.useForm.controls['maxAdult'].setErrors({
        incorrect: true,
      });
      this.useForm.controls['maxAdult'].markAsTouched();
    }
  }

  getRoomTypeById() {
    this.roomService.getRoomTypeById(this.hotelId, this.roomTypeId).subscribe(
      (res) => {
        this.useForm.patchValue(res);
      },
      (err) => {
        this.snackbarService.openSnackBarAsText(err.error.message);
      }
    );
  }

  updateDetails() {
    this.loader = true;
    if (this.useForm.valid) {
      const data = {
        ...this.setFormValue(),
        id: this.roomTypeId,
      };
      this.subscription$.add(
        this.roomService.updateRoomType(this.hotelId, data).subscribe(
          (res) => {
            this.loader = false;
            this.router.navigate([`/pages/inventory/room/${routes.dashboard}`]);
            this.snackbarService.openSnackBarAsText(
              'Room type is updated successfully',
              '',
              { panelClass: 'success' }
            );
          },
          (error) => {
            this.loader = false;
            this.snackbarService.openSnackBarAsText(error.error.message);
          }
        )
      );
    } else {
      this.loader = false;
      this.snackbarService.openSnackBarAsText('Invalid Form');
      this.useForm.markAllAsTouched();
      return;
    }
  }

  setFormValue() {
    const {
      complimentaryAmenities,
      paidAmenities,
      discountedPriceCurrency,
      variablePriceCurrency,
      ...rest
    } = this.useForm.getRawValue();

    const data = {
      ...rest,
      roomAmenityIds: complimentaryAmenities.concat(paidAmenities),
      status: true,
    };
    return data;
  }

  getControlValue(control: string) {
    return this.useForm.get(control).value;
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
