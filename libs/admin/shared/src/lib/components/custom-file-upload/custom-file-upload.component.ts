import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { PackageService } from 'libs/admin/packages/src/lib/services/package.service';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user-detail.service';

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
    private _snackbarService: SnackBarService,
    private _globalService: GlobalFilterService,
    private _userDetailsService: UserService
  ) {}

  subscription$ = new Subscription();
  hotelId: string;
  imageUrl: any[] = [];
  tempImageUrl: any[] = [];

  @Input() multipleFileUpload: boolean = false;
  @Input() path = 'static-content/files';

  fileUploadData = {
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };

  ngOnInit(): void {
    this.hotelId = this._globalService.hotelId;
  }

  onChange = (value: any[]) => {};
  onTouched = () => {};

  writeValue(controlValue: any[]): void {
    this.imageUrl = controlValue;
    this.tempImageUrl = [...this.imageUrl, ''];
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  uploadFile(event, index: number): void {
    const formData = new FormData();
    formData.append('files', event.file);
    this.subscription$.add(
      this._userDetailsService
        .uploadImage(this.hotelId, formData, this.path)
        .subscribe(
          (response) => {
            this.imageUrl.splice(index, 1, response.fileDownloadUri);
            this.tempImageUrl = [...this.imageUrl, ''];
            this._snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.SUCCESS.IMAGE_UPLOADED',
                  priorityMessage: 'image uploaded successfully.',
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
  }

  deleteFile(index: number) {
    this.imageUrl.splice(index, 1);
    this.tempImageUrl = [...this.imageUrl, ''];
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
