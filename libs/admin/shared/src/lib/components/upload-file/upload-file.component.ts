import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'hospitality-bot-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {

  @Input() url: string;
  @Input() maxFileSize;
  @Input() uploadStatus: boolean;
  @Input() fileType: string[];
  
  @Output()
  fileData = new EventEmitter();
  
  error = 'Invalid FileType';
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
        this.checkFileType(extension)&&
        fileSize <= +this.maxFileSize
      ) {
        reader.onload = (_event) => {
          const result: string = reader.result as string;
          this.url = result;
          const data = {
            file: file,
            imageUrl: this.url,
          };
          this.fileData.emit(data);
        };
      } else {
      }
    }
  }

  checkFileType(extension: string) {
    return this.fileType.includes(extension);
  }
}
