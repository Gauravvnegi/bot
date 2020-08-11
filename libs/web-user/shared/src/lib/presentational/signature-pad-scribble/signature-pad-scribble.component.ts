import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';

@Component({
  selector: 'hospitality-bot-signature-pad',
  templateUrl: './signature-pad-scribble.component.html',
  styleUrls: ['./signature-pad-scribble.component.scss']
})
export class SignaturePadScribbleComponent {
  @ViewChild('sPad', {static: true}) signaturePad: SignaturePad;
  private _settings;
  private _defaultValue = {
    signaturePadOptions : {
      'minWidth': 1.3,
      'canvasWidth': 700,
      'canvasHeight': 250,
      'maxWidth':2
    },
    scribbleContainer: 'signContainer',
    clear: 'clearSign'
  };

  @Input('settings') set settings(value) {
    this._settings = { ...this._defaultValue, ...value };
  }

  get settings() {
    return { ...this._defaultValue, ...this._settings };
  }

  ngAfterViewInit(): void {
    this.clearSignature();
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

}
