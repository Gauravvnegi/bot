import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Self,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl,
} from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { forkJoin, Subscription } from 'rxjs';
import { fileUploadConfiguration } from '../../constants';
import { UserService } from '../../services/user-detail.service';
import { UploadFileData } from '../../types/fields.type';

@Component({
  selector: 'hospitality-bot-custom-file-upload',
  templateUrl: './custom-file-upload.component.html',
  styleUrls: ['./custom-file-upload.component.scss'],
  providers: [],
})
export class CustomFileUploadComponent
  implements ControlValueAccessor, OnChanges, OnDestroy, OnInit {
  subscription$ = new Subscription();
  url: string = '';
  thumbUrl: string;
  defaultImage: string = 'assets/images/image-upload.png';

  @ViewChild('fileInput') input: ElementRef;
  @Input() path = 'static-content/files';
  @Input() entityId: string;
  @Input() limit: number = 1;
  unit: number = 1;
  isMultiple: boolean = false;
  @Input() parentFG: FormGroup;
  @Input() isDisable = false;

  @Input() baseType: keyof typeof fileUploadConfiguration = 'image';

  @Input() set settings(value: {
    limit: number;
    unit: number;
    isMultiple: boolean;
  }) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        this[key] = value[key];
      }
    }
  }

  defaultValue: UploadFileData = {
    maxFileSize: 3145728,
    fileType: fileUploadConfiguration[this.baseType],
  };

  uploadData: UploadFileData;

  @Input() set fileUploadData(value: UploadFileData) {
    this.uploadData = { ...this.defaultValue, ...value };
  }

  get uploadFileData() {
    return { ...this.defaultValue, ...this.uploadData };
  }

  @Input() label: string = '';
  @Input() description: string = 'Mandatory to add at least 1 image';
  @Input() hint: string = 'Recommended Ratio : 16:9 | 3 MB Max Size';
  @Input() validationErrMsg: string = 'Image is required.';
  indexToBeUpload: number;
  fileUrls: string[];
  featureValueIndex: number[] = [0];
  @Input() isFeatureView: boolean = false;
  useForm: FormGroup;
  formArray: FormArray;

  constructor(
    private snackbarService: SnackBarService,
    private userDetailsService: UserService,
    private fb: FormBuilder,
    @Self() @Optional() public control: NgControl
  ) {
    if (this.control) this.control.valueAccessor = this;
  }

  ngOnInit(): void {}

  /**
   * @function processCheckboxChange
   * @description process checkbox change
   * @param event
   * @param index
   */
  processCheckboxChange(event, index) {
    if (event.target.checked) {
      this.featureValueIndex.push(index);
    } else {
      this.featureValueIndex = this.featureValueIndex?.filter(
        (item) => item !== index
      );
    }
    this.onChange(this.getChangedData());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && this.parentFG) {
      this.thumbUrl = this.parentFG.controls['thumbnailUrl'].value;
    }
    if (!this.fileUrls)
      this.fileUrls = Array(this.limit * this.unit).fill(this.defaultImage);
    this.defaultValue['fileType'] = fileUploadConfiguration[this.baseType];
  }

  onChange = (value: ValueType) => {};
  onTouched = () => {};

  writeValue(controlValue: ValueType): void {
    if (typeof controlValue == 'string' && controlValue != '') {
      this.fileUrls = [controlValue];
    } else if (typeof controlValue === 'object' && controlValue?.length) {
      if (this.isFeatureView) this.featureValueIndex = [];
      this.fileUrls = Array(this.getImageLength(controlValue.length, this.unit))
        .fill(this.defaultImage)
        .map((item, idx) => {
          const value = controlValue[idx];
          if (value) {
            if (typeof value === 'object') {
              if (value.isFeatured) this.featureValueIndex.push(idx);
              return value.url;
            } else {
              return value;
            }
          } else {
            return item;
          }
        });
    }
  }

  getImageLength(currentLength: number, interval: number) {
    if (currentLength >= 1 && currentLength <= interval) {
      return interval;
    } else {
      const nextMultiple = Math.ceil(currentLength / interval) * interval;
      return nextMultiple;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  uploadImageFile(event, index: number): void {
    const formData = new FormData();
    formData.append('files', event.file);
    this.subscription$.add(
      this.userDetailsService
        .uploadImage(this.entityId, formData, this.path)
        .subscribe(
          (response) => {
            if (this.unit == 1) {
              this.fileUrls.splice(index, 1, response.fileDownloadUri);
              this.onChange(this.fileUrls[index]);
            } else {
              this.fileUrls.splice(index, 1, response.fileDownloadUri);
              this.onChange(this.getChangedData());
            }
            this.showSnackbarMessages(
              'success',
              'Image uploaded successfully.'
            );
          },
          ({ error }) => {
            this.showSnackbarMessages(
              'error',
              null,
              `messages.error.${error?.type}`,
              error?.message
            );
          }
        )
    );
  }

  onSelectFile(event, index: number = this.indexToBeUpload) {
    this.url = '';
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      const file = event.target.files[0];
      const fileSize = event.target.files[0].size;
      const extension = file.name.split('.')[1];
      const name = file.name.split('.')[0];
      if (
        this.checkFileType(extension) &&
        fileSize <= +this.uploadFileData.maxFileSize
      ) {
        if (this.baseType == 'video') {
          reader.onload = (_event) => {
            const result = reader.result as string;
            this.createThumbnail(file, name).then((value) => {
              this.thumbUrl = value['url'];
              const data = {
                file: file,
                imageUrl: this.thumbUrl,
                thumbnailFile: value['file'],
              };
              this.uploadVideoFile(data);
            });
          };
        } else if (this.baseType == 'image') {
          reader.onload = (_event) => {
            const result = reader.result as string;
            this.url = result;
            const data = {
              file: file,
              imageUrl: this.url,
            };
            this.uploadImageFile(data, index);
          };
        }
      } else {
        this.showSnackbarMessages(
          'error',
          null,
          'message.error.upload',
          'File size can not be more than 3 MB'
        );
      }
    }
  }

  createThumbnail(file, name) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const video = document.createElement('video');
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);
      video.onloadeddata = () => {
        const ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        const url = canvas.toDataURL('image/png');
        return resolve({ url, file: this.createFileFrombase64(url, name) });
      };
    });
  }

  createFileFrombase64(dataURL, filename) {
    let arr = dataURL.split(','),
      fileType = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], `${filename}.png`, { type: fileType });
  }

  uploadVideoFile(event): void {
    const formData = new FormData();
    formData.append('files', event.file);
    const thumbnailData = new FormData();
    thumbnailData.append('files', event.thumbnailFile);
    this.subscription$.add(
      forkJoin({
        videoFile: this.userDetailsService.uploadImage(
          this.entityId,
          formData,
          this.path
        ),
        thumbnail: this.userDetailsService.uploadImage(
          this.entityId,
          thumbnailData,
          this.path
        ),
      }).subscribe((response) => {
        this.parentFG.patchValue({
          url: response.videoFile.fileDownloadUri,
          thumbnailUrl: response.thumbnail.fileDownloadUri,
        });
        this.snackbarService;
        this.showSnackbarMessages('success', 'Video Uploaded Successfully.');
      })
    );
  }

  checkFileType(extension: string) {
    return this.uploadFileData.fileType.includes(extension);
  }

  removeImage(index: number) {
    this.fileUrls[index] = this.defaultImage;
    if (this.limit == 1) {
      this.onChange('');
      this.control.control.markAsTouched();
    }
    if (this.baseType == 'video') {
      this.parentFG.controls['url'].setValue('');
      this.parentFG.controls['thumbnailUrl'].setValue('');
      this.thumbUrl = '';
    } else {
      this.onChange(this.getChangedData());
    }
  }

  uploadFiles(index: number) {
    this.input.nativeElement.click();
    this.indexToBeUpload = index;
  }

  showSnackbarMessages(
    messageType: string,
    message?: string,
    translateKeyValue?: string,
    priorityMessageValue?: string
  ) {
    if (messageType == 'success') {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: 'messages.SUCCESS.IMAGE_UPLOADED',
            priorityMessage: message,
          },
          '',
          { panelClass: 'success' }
        )
        .subscribe();
    } else {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: translateKeyValue,
            priorityMessage: priorityMessageValue,
          },
          '',
          { panelClass: 'danger' }
        )
        .subscribe();
    }
  }

  getChangedData() {
    if (this.isFeatureView) {
      const data: FeatureValue = this.fileUrls.map((item, index) => ({
        url: item,
        isFeatured: this.featureValueIndex.includes(index),
      }));
      data.filter((item) => item.url !== this.defaultImage);
      return data;
    }
    const fileUrls = this.fileUrls.filter((item) => item !== this.defaultImage);
    return fileUrls;
  }

  addMoreImages() {
    this.fileUrls.push(...Array(this.unit).fill(this.defaultImage));
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
type FeatureValue = { url: string; isFeatured: boolean }[];
type ValueType = string | string[] | FeatureValue;
