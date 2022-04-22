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
          this.createThumbnail(file).then((value) => {
            this.url = value['url'];
            const data = {
              file: file,
              imageUrl: this.url,
              pageType: this.pageType,
              documentType: this.documentType,
              thumbnailFile: value['file'],
            };
            this.fileData.emit(data);
          });
        };
      }
    }
  }

  createThumbnail(file) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const video = document.createElement('video');

      // this is important
      video.autoplay = true;
      video.muted = true;
      video.src = URL.createObjectURL(file);

      video.onloadeddata = () => {
        let ctx = canvas.getContext('2d');

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        video.pause();
        const url = canvas.toDataURL('image/png');
        return resolve({ url, file: this.createFileFrombase64(url) });
      };
    });
  }

  createFileFrombase64(dataURL) {
    var blobBin = atob(dataURL.split(',')[1]);
    var array = [];
    for (var i = 0; i < blobBin.length; i++) {
      array.push(blobBin.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/png' });
  }
  checkFileType(extension: string) {
    return this.uploadFileData.fileType.includes(extension);
  }
}
