import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-upload-video',
  templateUrl: './upload-video.component.html',
  styleUrls: ['./upload-video.component.scss'],
})
export class UploadVideoComponent implements OnInit {
  private defaultValue = {
    maxFileSize: 3145728,
    fileType: ['png', 'jpg'],
  };
  _fileUploadData;

  @Input() url: string;
  @Input() uploadStatus: boolean;
  @Input() pageType: string;
  @Input() documentType: string;
  @Input() isDisable: boolean = false;
  @Input('fileUploadData') set fileUploadData(value: {}) {
    this._fileUploadData = { ...this.defaultValue, ...value };
  }

  get uploadFileData() {
    return { ...this.defaultValue, ...this._fileUploadData };
  }

  @Output()
  fileData = new EventEmitter();

  error = 'Invalid FileType';
  constructor() {}

  ngOnInit(): void {}

  onSelectFile(event) {
    this.url = '';
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url
      const file = event.target.files[0];
      const fileSize = event.target.files[0].size;
      const extension = file.name.split('.')[1];
      if (
        this.checkFileType(extension) &&
        fileSize <= +this.uploadFileData.maxFileSize
      ) {
        reader.onload = (_event) => {
          const result: string = reader.result as string;
          this.url = result;
          const data = {
            file: file,
            imageUrl: this.url,
            pageType: this.pageType,
            documentType: this.documentType,
          };
          this.fileData.emit(data);
        };
      } else {
      }
    }
  }

  checkFileType(extension: string) {
    return this.uploadFileData.fileType.includes(extension);
  }
}