import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import * as JSZipUtils from 'jszip-utils';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Subscription } from 'rxjs';
import { ButtonService } from '../../services/button.service';
import { SignatureService } from '../../services/signature.service';
import { UtilityService } from '../../services/utility.service';
import { SignaturePadScribbleComponent } from '../signature-pad-scribble/signature-pad-scribble.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-signature-capture-wrapper',
  templateUrl: './signature-capture-wrapper.component.html',
  styleUrls: ['./signature-capture-wrapper.component.scss'],
})
export class SignatureCaptureWrapperComponent
  implements OnChanges, AfterViewInit {
  private _dialogRef: MatDialogRef<any>;
  private _settings;
  private $subscription: Subscription = new Subscription();
  private _defaultValue = {
    label: 'Click to Sign',
    styles: {
      tagLineClass: 'signature--tagline',
      imageContainerStyle: 'signature-image-container',
      signatureCaptureStyle: 'signature-capture-style',
      modal: {
        container: 'container',
        header: 'modal-header',
        title: 'modal-title',
        body: 'modal-body',
        footer: 'modal-footer',
      },
    },
    options: [
      {
        type: 'scribble',
        label: 'Draw',
        settings: {
          signaturePadOptions: {
            minWidth: 1.3,
            canvasWidth: (window.innerWidth * 58.4) / 100,
            canvasHeight: 250,
            maxWidth: 2,
          },
          scribbleContainer: 'signContainer',
          clear: 'clearSign',
        },
      },
      // {
      //   type: 'text',
      //   label: 'Type',
      //   settings: {
      //     options: [],
      //     contentType: 'text',
      //     required: false,
      //     order: 0,
      //     key: '7',
      //     value: '',
      //     placeholder: 'Enter your name',
      //     type: 'input',
      //     icon: '',
      //   },
      //   styles: {
      //     container: 'text-container',
      //     signature: 'text-signature',
      //   },
      // },
      {
        type: 'file',
        label: 'Upload',
        settings: {
          fileConfig: {
            fileIcon: '',
            accept: '.pdf,.img,.png,.jpg,.jpeg',
            maxFileSize: 3145728,
          },
        },
        styles: {
          container: 'text-container',
        },
      },
    ],
    uploadAPI: '',
  };

  @ViewChild('matTab') matTab: MatTabGroup;
  @ViewChild('signatuePadScribbleComponent')
  signatuePadScribbleComponent: SignaturePadScribbleComponent;

  uploadType = '';
  signature = {
    signatureImg: '',
    signatureText: '',
  };
  signatureForm: FormGroup;

  @Input() imgUrl: string;
  @Input('settings') set settings(value) {
    this._settings = { ...this._defaultValue, ...value };
  }
  @Output()
  signatureData = new EventEmitter();

  get settings() {
    if (this._settings !== undefined) {
      return { ...this._defaultValue, ...this._settings };
    } else {
      return this._defaultValue;
    }
  }

  @ViewChild('saveButton') saveButton: ElementRef<any>;

  constructor(
    private _fb: FormBuilder,
    private _modal: ModalService,
    private _signatureService: SignatureService,
    private _buttonService: ButtonService,
    private _utilityService: UtilityService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {
    this.initFormGroup();
  }

  ngAfterViewInit() {
    this.registerListeners();
  }

  registerListeners() {
    this.listenForSignatureUpload();
  }

  listenForSignatureUpload() {
    this._utilityService.$signatureUploaded.subscribe((res) => {
      if (res) {
        this.onClose();
      }
    });
  }

  ngOnChanges() {
    this.signature.signatureImg = this.imgUrl !== undefined ? this.imgUrl : '';
  }

  initFormGroup() {
    this.signatureForm = this._fb.group({
      textSignature: new FormControl(''),
      imageSignature: new FormControl(''),
    });
  }

  openSignatureModal(modalRef) {
    this._dialogRef = this._modal.openDialog(modalRef, {
      width: '80%',
    });
  }

  onClose(): void {
    this.signatureForm.patchValue({
      textSignature: '',
      imageSignature: '',
    });
    if (this._dialogRef) {
      this._buttonService.buttonLoading$.next(this.saveButton);
      this._dialogRef.close();
    }
  }

  onUploadSignature() {
    const TAB_INDEX = this.matTab['_selectedIndex'];
    const TAB_LABEL = this.matTab['_tabs']['_results'][TAB_INDEX]['textLabel'];
    let image;
    if (TAB_LABEL === 'Draw') {
      if (this.signatuePadScribbleComponent.signaturePad.isEmpty()) {
        this._translateService
          .get(`VALIDATION.SIGNATURE_PAD_PENDING`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        this._buttonService.buttonLoading$.next(this.saveButton);
        return;
      }
      this.signature.signatureText = '';
      image = this.dataURItoFile(
        this.signatuePadScribbleComponent.signaturePad.toDataURL()
      );
      this.setSignatureData(image);
    } else if (TAB_LABEL === 'Type') {
      const text = this.textSignature;
      if (text === '') {
        this._translateService
          .get(`VALIDATION.SIGNATURE_NAME_PENDING`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        this._buttonService.buttonLoading$.next(this.saveButton);
        return;
      }
      this.textToFile(text);
    } else if (TAB_LABEL === 'Upload') {
      if (this.uploadType === '') {
        this._translateService
          .get(`VALIDATION.SIGNATURE_FILE_PENDING`)
          .subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        this._buttonService.buttonLoading$.next(this.saveButton);
        return;
      }
      this.signature.signatureImg = this.uploadType;
      this.signature.signatureText = '';
      image = this.signature['signatureFile'];
      this.uploadType = '';
      this.setSignatureData(image);
    }
  }

  setSignatureData(image) {
    const data = {
      file: image,
    };
    this.signatureData.emit(data);
  }

  textToFile(text) {
    const data = {
      imageText: text,
      fontColor: '#000000',
      fontFamily: 'Arial',
      fontSize: 30,
      imageHeight: 50,
      imageWidth: 90,
      imgBackgroundClolor: '#FFFFFF',
      lineSize: 10,
    };
    this.$subscription.add(
      this._signatureService.convertTextToImage(data).subscribe(
        (res) => {
          this.signature.signatureImg = res['file_download_url'];
          this.urlToFile(res.file_download_url, res.file_type);
        },
        ({ error }) =>
          this.$subscription.add(
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              })
          )
      )
    );
  }

  signatureUploadFile(event?, docObject?) {
    this.uploadType = event['imageUrl'];
    this.signature['signatureFile'] = event['file'];
  }

  urlToFile(url, type) {
    let file;
    JSZipUtils.getBinaryContent(url, (err, data) => {
      if (err) {
        throw err;
      }
      const blob = new Blob([data], { type: type });
      file = new File(
        [blob],
        'signature.' + type.substring(type.lastIndexOf('/') + 1, type.length),
        {
          type,
          lastModified: Date.now(),
        }
      );
      this.setSignatureData(file);
    });
  }

  dataURItoFile(dataURI) {
    this.signature.signatureImg = dataURI;
    const BASE64_MARKER = ';base64,';
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    const BASE64 = dataURI.substring(base64Index);
    const IMAGE_ARRAY = this.base64ToImageArray(BASE64);
    return this.convertToFile(IMAGE_ARRAY);
  }

  base64ToImageArray(base64) {
    const RAW_IMAGE = window.atob(base64);
    const RAW_IMAGE_LENGTH = RAW_IMAGE.length;
    let imageArray = new Uint8Array(new ArrayBuffer(RAW_IMAGE_LENGTH));

    for (let i = 0; i < RAW_IMAGE_LENGTH; i++) {
      imageArray[i] = RAW_IMAGE.charCodeAt(i);
    }
    return imageArray;
  }

  convertToFile(imageArray) {
    const BLOB = new Blob([imageArray], { type: 'image/png' });
    const IMAGE_FILE = new File([BLOB], 'signature.png', {
      type: 'image/png',
      lastModified: Date.now(),
    });
    return IMAGE_FILE;
  }

  /**********************************************Getter Setters************************************* */

  get textSignature() {
    return this.signatureForm.get('textSignature').value;
  }

  get imageSignature() {
    return this.signatureForm.get('imageSignature').value;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
