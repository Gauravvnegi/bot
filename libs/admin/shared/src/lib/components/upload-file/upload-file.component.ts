import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @Input() url: string;
  @Input() maxfileSize;
  @Input() fileType: string[];

  @Output()
  fileData = new EventEmitter();

  error = 'Invalid FileType';
  isValidDocument = true;

  constructor() { }

  ngOnInit(): void {
  }

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
        fileSize <= +this.maxfileSize
      ) {
        reader.onload = (_event) => {
          const result: string = reader.result as string;
          this.url = result;
          this.isValidDocument = true;
          const data = {
            file: file,
            imageUrl: this.url,
          };
          this.fileData.emit(data);
        };
      } else {
        this.isValidDocument = false;
      }
    }
  }

  checkFileType(extension: string) {
    return true;
  }

}
