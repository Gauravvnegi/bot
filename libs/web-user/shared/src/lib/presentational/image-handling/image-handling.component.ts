import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'libs/shared/image-cropper/src/lib/interfaces';

import { base64ToFile } from 'libs/shared/image-cropper/src/lib/utils/blob.utils';

@Component({
  selector: 'web-user-image-handling',
  templateUrl: './image-handling.component.html',
  styleUrls: ['./image-handling.component.scss'],
})
export class ImageHandlingComponent {
  @Input() imageChangedEvent: any = '';
  @Output() onModalClose = new EventEmitter();
  imageConfig;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};

  imageCropped(event: ImageCroppedEvent) {
    const blob = base64ToFile(event.base64);
    const file: File = new File(
      [blob],
      this.imageChangedEvent?.target.files[0].name,
      {
        type: 'image/png',
      }
    );
    this.croppedImage = { file: file, url: event.base64 };
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
  }

  loadImageFailed() {
    console.log('Load failed');
  }

  rotateLeft() {
    this.canvasRotation--;
    this.flipAfterRotate();
  }

  rotateRight() {
    this.canvasRotation++;
    this.flipAfterRotate();
  }

  private flipAfterRotate() {
    const flippedH = this.transform.flipH;
    const flippedV = this.transform.flipV;
    this.transform = {
      ...this.transform,
      flipH: flippedV,
      flipV: flippedH,
    };
  }

  flipHorizontal() {
    this.transform = {
      ...this.transform,
      flipH: !this.transform.flipH,
    };
  }

  flipVertical() {
    this.transform = {
      ...this.transform,
      flipV: !this.transform.flipV,
    };
  }

  resetImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {};
  }

  zoomOut() {
    this.scale -= 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  zoomIn() {
    this.scale += 0.1;
    this.transform = {
      ...this.transform,
      scale: this.scale,
    };
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  sendCroppedImage() {
    this.onModalClose.emit({ status: true, data: this.croppedImage });
  }
}
