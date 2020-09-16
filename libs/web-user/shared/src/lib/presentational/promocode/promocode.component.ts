import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'web-user-promocode',
  templateUrl: './promocode.component.html',
  styleUrls: ['./promocode.component.scss'],
})
export class PromocodeComponent {
  promocodeForm: FormGroup;
  private _settings;
  private _defaultValue = {
    textControl: {
      options: [],
      contentType: 'text',
      required: false,
      order: 0,
      key: '7',
      value: '',
      placeholder: 'Have a Promocode? Enter Here',
      type: 'input',
      icon: '',
      label: '',
      floatLabel: 'always',
    },
  };
  @Input('settings') set settings(value) {
    this._settings = { ...this._defaultValue, ...value };
  }

  @Output() promocodeData = new EventEmitter();

  get settings() {
    return { ...this._defaultValue, ...this._settings };
  }
  constructor(
    private _fb: FormBuilder,
    private _snackBarService: SnackBarService
  ) {
    this.initFormGroup();
  }

  initFormGroup() {
    this.promocodeForm = this._fb.group({
      promocode: new FormControl(''),
    });
  }

  applyPromocode() {
    const text = this.textPromocode;
    if (text === '') {
      this._snackBarService.openSnackBarAsText('Please enter promocode!');
      return;
    }
    this.setPromocode(text);
  }

  setPromocode(text: string) {
    const data = {
      promocode: text,
    };
    this.promocodeData.emit(data);
  }

  get textPromocode() {
    return this.promocodeForm.get('promocode').value;
  }
}
