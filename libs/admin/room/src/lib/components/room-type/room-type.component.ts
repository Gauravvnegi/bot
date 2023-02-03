import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { IpackageOptions } from 'libs/admin/packages/src/lib/data-models/packageConfig.model';
import { PackageService } from 'libs/admin/packages/src/lib/services/package.service';
import * as _ from 'lodash';
// import { map } from 'lodash';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Amenities, Amenity } from '../../model/amenities.model';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'hospitality-bot-room-type',
  templateUrl: './room-type.component.html',
  styleUrls: ['./room-type.component.scss'],
})
export class RoomTypeComponent implements OnInit, OnDestroy {
  constructor(
    private _location: Location,
    private _fb: FormBuilder,
    private _roomService: RoomService,
    private _globalService: GlobalFilterService,
    private _configService: ConfigService,
    private _packageService: PackageService,
    private _snackbarService: SnackBarService
  ) {}

  selectProperty: any = 'name';
  subscription$ = new Subscription();
  paidAmenities: Amenity[];
  compAmenities: Amenity[];
  amenities: Amenities;
  currency: IpackageOptions[];
  hotelId: string;
  discount: any[] = [
    {
      key: 'Percentage',
      value: 'Percentage',
    },
    {
      key: 'Number',
      value: 'Number',
    },
  ];

  fileUploadData = {
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };

  imageUrl: any[] = [];
  imageName: any[] = [];
  data: any[];

  addRoomTypeForm: FormGroup;

  ngOnInit(): void {
    this.initAddRoomTypeForm();
    this.getAmenities();
    this.getConfigByHotelID();
  }

  initAddRoomTypeForm() {
    this.addRoomTypeForm = this._fb.group({
      typeName: ['', []],
      // imageUrl: new FormArray
      // ]),
      // imageName: [''],
      message: ['', [Validators.required]],
      compAmenities: ['', []],
      paidAmenities: ['', []],
      originalPrice: ['', []],
      discountType: ['', []],
      discountedPrice: ['', []],
    });
  }

  back() {
    this._location.back();
  }

  getAmenities() {
    this.hotelId = this._globalService.hotelId;
    this.subscription$.add(
      this._roomService
        .getAmenities(this.hotelId)
        .pipe(map((x) => x.records))
        .subscribe((res: any[]) => {
          // this.amenities = res;
          // this.paidAmenities = _.map(
          //   this.amenities.filter((x) => x.type == 'Paid'),
          //   (e) => _.pick(e, ['id', 'name', 'imageUrl', 'type', 'rate'])
          // );

          // this.compAmenities = _.map(
          //   this.amenities.filter((x) => x.type == 'Complimentary'),
          //   (e) => _.pick(e, ['id', 'name', 'imageUrl', 'type'])
          // );

          this.amenities = new Amenities().deserialize(res);
          this.paidAmenities = this.amenities.paidAmenities;
          this.compAmenities = this.amenities.compAmenities;

          console.log(this.paidAmenities, 'paid amenities');
          console.log(this.compAmenities, 'comp amenities');
          console.log(this.amenities);
        })
    );
  }

  getConfigByHotelID() {
    this._configService
      .getColorAndIconConfig(this.hotelId)
      .subscribe((response) => {
        this.setCurrencyOptions(response.currencyConfiguration);
      });
  }

  setCurrencyOptions(data) {
    this.currency = new Array<IpackageOptions>();
    data.forEach((d) => this.currency.push({ key: d.key, value: d.value }));
    console.log(this.currency, 'currency');
  }

  uploadFile(event): void {
    const formData = new FormData();
    formData.append('files', event.file);
    this.subscription$.add(
      this._packageService.uploadImage(this.hotelId, formData).subscribe(
        (response) => {
          // this.addRoomTypeForm
          //   .get('imageUrl')
          //   .patchValue(response.fileDownloadUri);
          // this.addRoomTypeForm.get('imageName').patchValue(response.fileName);
          this.imageUrl.push(response.fileDownloadUri);
          this.imageName.push(response.fileName);
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.CATEGORY_IMAGE_UPLOADED',
                priorityMessage: 'Category image uploaded successfully.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
        },
        ({ error }) => {
          this._snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  get categoryImageUrl(): string {
    return this.addRoomTypeForm.get('imageUrl').value;
  }

  saveDetails() {
    // this.addRoomTypeForm.get('imageUrl').patchValue(this.imageUrl);
    // this.addRoomTypeForm.get('imageName').patchValue(this.imageName);
    console.log(this.addRoomTypeForm.value);
    console.log(this.imageName);
    console.log(this.imageUrl);
  }

  get testArray(): FormArray {
    return this.addRoomTypeForm.get('imageUrl') as FormArray;
  }

  uploadMore() {
    this.testArray.push(new FormControl(null));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
