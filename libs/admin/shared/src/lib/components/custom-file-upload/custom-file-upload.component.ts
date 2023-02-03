import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormControl,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { PackageService } from 'libs/admin/packages/src/lib/services/package.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: CustomFileUploadComponent,
      multi: true,
    },
  ],
})
export class CustomFileUploadComponent
  implements OnInit, ControlValueAccessor, OnDestroy {
  constructor(
    private _packageService: PackageService,
    private _snackbarService: SnackBarService,
    private _globalService: GlobalFilterService
  ) {}

  subscription$ = new Subscription();
  hotelId: string;
  imageUrl: any[] = [];
  imageName: any[] = [];
  fileUploadData = {
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };
  value: any[];

  // control = new FormControl();

  ngOnInit(): void {
    this.hotelId = this._globalService.hotelId;
  }

  onChange = (value: any[]) => {};
  onTouched = () => {};

  writeValue(controlValue: any[]): void {
    this.value = controlValue;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
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
          // this.imageName.push(response.fileName);
          // if (!this.imageUrl.includes(response.fileDownloadUri)) {
          //   this.imageUrl.push(response.fileDownloadUri);
          //   if (this.imageUrl.length == 2) {
          //     this.imageUrl.splice(0, 1);
          //   }
          // }
          // this.onChange(this.imageUrl);
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
    this.onChange(this.imageUrl);
    console.log(this.imageUrl);
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
