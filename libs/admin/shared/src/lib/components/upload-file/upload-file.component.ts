import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss'],
})
export class UploadFileComponent implements OnInit {
  private defaultValue = {
    maxFileSize: 3145728,
    fileType: ['png', 'jpg'],
  };
  _fileUploadData;

  @Input() url: string;
  @Input() uploadStatus: boolean;
  @Input() pageType: string;
  @Input() documentType: string;
  @Input() isDisable = false;
  @Input() doNotSave = false;
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
          const result = reader.result as string;
          if(!this.doNotSave) this.url = result;
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
