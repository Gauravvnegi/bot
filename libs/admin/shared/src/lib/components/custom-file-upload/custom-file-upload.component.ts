import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
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
    private _userDetailsService: UserService
  ) {}

  subscription$ = new Subscription();
  fileUrl: string[] = [];
  tempFileUrl: string[] = [];

  @Input() multipleFileUpload: boolean = false;
  @Input() path = 'static-content/files';
  @Input() hotelId: string;

  fileUploadData = {
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };

  ngOnInit(): void {}

  onChange = (value: any[]) => {};
  onTouched = () => {};

  writeValue(controlValue: any[]): void {
    this.fileUrl = controlValue;
    this.tempFileUrl = [...this.fileUrl, ''];
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
            this.fileUrl.splice(index, 1, response.fileDownloadUri);
            this.tempFileUrl = [...this.fileUrl, ''];
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
    this.onChange(this.fileUrl);
  }

  deleteFile(index: number) {
    this.fileUrl.splice(index, 1);
    this.tempFileUrl = [...this.fileUrl, ''];
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
