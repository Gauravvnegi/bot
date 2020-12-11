import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { BaseComponent } from '../base.component';

@Component({
  selector: 'web-user-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent extends BaseComponent {
  @Input() url: string;
  @Input() fileSize;
  @Input() isUploading: boolean;
  @Input() fileType: string[];
  @Input() documentType: string;

  @Output()
  documentData = new EventEmitter();

  error = 'Invalid FileType';
  isValidDocument = true;

  @Input() fileConfig = {
    fileIcon: 'assets/passport_back.svg',
    accept: '.pdf,.img,.png,.jpg,.jpeg',
    maxFileSize: 3145728,
  };

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
        fileSize <= +this.fileConfig.maxFileSize
      ) {
        reader.onload = (_event) => {
          const result: string = reader.result as string;
          this.url = result;
          this.isValidDocument = true;
          const data = {
            file: file,
            formGroup: this.parentForm,
            documentPage: this.settings.type,
            index: this.index,
            imageUrl: this.url,
          };
          this.documentData.emit(data);
        };
      } else {
        this.isValidDocument = false;
      }
    }
  }

  checkFileType(extension: string) {
    return this.fileConfig.accept
      .split(',')
      .includes(`.${extension.toLowerCase()}`);
  }
}
