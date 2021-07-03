import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, Input, EventEmitter, Output } from '@angular/core';
import { MatDialogConfig } from '@angular/material/dialog';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { UtilityService } from '../../services/utility.service';
import { ValidatorService } from '../../services/validator.service';
import { BaseComponent } from '../base.component';
import { ImageHandlingComponent } from '../image-handling/image-handling.component';

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

  constructor(
    protected _utility: UtilityService,
    protected _breakpointObserver: BreakpointObserver,
    protected validatorService: ValidatorService,
    private modalService: ModalService
  ) {
    super(_utility, _breakpointObserver, validatorService);
  }

  onSelectFile(event) {
    this.url = '';
    if (event.target.files && event.target.files[0]) {
      // const reader = new FileReader();
      // reader.readAsDataURL(event.target.files[0]); // read file as data url
      const file = event.target.files[0];
      // const fileSize = event.target.files[0].size;
      const splitVal = file.name.split('.');
      const extension = splitVal[splitVal.length - 1];
      if (this.checkFileType(extension)) {
        this.openCropperModal(event);
        // reader.onload = (_event) => {
        //   const result: string = reader.result as string;
        //   this.url = result;
        //   const data = {
        //     file: file,
        //     formGroup: this.parentForm,
        //     documentPage: this.settings.type,
        //     index: this.index,
        //     imageUrl: this.url,
        //   };
        //   this.documentData.emit({ ...data, ...{ status: true } });
        // };
      } else {
        this.documentData.emit({ status: false });
        this.isValidDocument = false;
      }
    }
  }

  checkFileType(extension: string) {
    return this.fileConfig.accept
      .split(',')
      .includes(`.${extension.toLowerCase()}`);
  }

  openCropperModal(image) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'image-cropper-modal';
    dialogConfig.width = '75vw';

    const dialogRef = this.modalService.openDialog(
      ImageHandlingComponent,
      dialogConfig
    );

    dialogRef.componentInstance.imageChangedEvent = image;

    dialogRef.componentInstance.onModalClose.subscribe((response) => {
      if (response.status) {
        if (response.data.file.size <= +this.fileConfig.maxFileSize) {
          this.isValidDocument = true;
          const data = {
            file: response.data.file,
            formGroup: this.parentForm,
            documentPage: this.settings.type,
            index: this.index,
            imageUrl: response.data.url,
          };
          this.documentData.emit({ ...data, ...{ status: true } });
        } else {
          this.isValidDocument = false;
        }
      }
      dialogRef.close();
    });
  }
}
