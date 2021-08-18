import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CountryCode } from '../../../../../../shared/models/country-code.model';
import { Subject } from 'rxjs';
import { Regex } from '../../../../../../shared/constants/regex';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-manual-checkin',
  templateUrl: './manual-checkin.component.html',
  styleUrls: ['./manual-checkin.component.scss'],
})
export class ManualCheckinComponent implements OnInit {
  countries = new CountryCode().getByLabelAndValue();
  checkinFG: FormGroup;
  private _defaultValue = {
    title: '',
    description: '',
    question: 'Are you sure you want to continue?',
    buttons: {
      cancel: {
        label: 'Cancel',
        context: '',
      },
      accept: {
        label: 'Checkin',
        context: '',
      },
    },
  };
  @Input() guest;
  @Input() loading;

  private _onOpenedChange = new Subject();
  onOpenedChange = this._onOpenedChange.asObservable();
  isOptionsOpenedChanged = true;
  @Output()
  optionChange = new EventEmitter();

  @Output() onDetailsClose = new EventEmitter();
  private _config;

  @Input('config') set config(value) {
    this._config = { ...this._defaultValue, ...value };
  }

  get config() {
    if (this._config !== undefined) {
      return { ...this._defaultValue, ...this._config };
    } else {
      return this._defaultValue;
    }
  }

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.checkinFG = this._fb.group({
      cc: [this.guest.countryCode || ''],
      phoneNumber: [
        this.guest.phoneNumber || '',
        Validators.pattern(Regex.NUMBER_REGEX),
      ],
    });
  }

  onAccept() {
    this.onDetailsClose.next({
      status: true,
      data: this.checkinFG.getRawValue(),
    });
  }

  onCancel() {
    this.onDetailsClose.next({ status: false });
  }

  openedChange(event) {
    this._onOpenedChange.next(event);
  }

  trackByFn(index, item) {
    return index;
  }

  change(event) {
    const selectData = {
      // index: this.index,
      selectEvent: event,
      formControlName: 'cc',
      formGroup: this.checkinFG,
    };
    this.optionChange.emit(selectData);
  }
}
