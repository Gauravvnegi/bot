import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { AbstractControl, ControlContainer } from '@angular/forms';
import { FormProps, Option } from '../../../types/form.type';
import { FormComponent } from '../form.components';
import { debounceTime } from 'rxjs/operators';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-prefix-field',
  templateUrl: './prefix-field.component.html',
  styleUrls: ['./prefix-field.component.scss'],
})
export class PrefixFieldComponent extends FormComponent implements OnInit {
  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  @Input() preFieldType: InputFieldTypes = 'select';
  @Input() postFieldType: InputFieldTypes = 'input';

  @Input() preControlName: string;
  @Input() postControlName: string;

  @Input() preOptions: Option[] = [];
  @Input() postOptions: Option[] = [];

  @Input() defaultProps: PrePostType<FormProps>;
  @Input() inputDisabled: PrePostType<boolean> = { pre: false, post: false };

  @Input() preMin: number;
  @Input() postMin: number;

  layout: 'default' | 'dashed' | 'pre-main' | 'post-main' | 'no-dashed' =
    'default';
  dashHidden = false;

  preInputControl: AbstractControl;
  postInputControl: AbstractControl;

  // If default are sent then two select option will be preControl value to postControl Options (vice-versa)
  @Input() set defaultOptions(value: Option[]) {
    console.log('Setting default first', this.showFilteredOptions, value);

    if (!this.showFilteredOptions && value.length) {
      this.showFilteredOptions = true;
      this._defaultOptions = value;

      this.setFilteredOptions({
        postValue: this.postInputControl?.value,
        preValue: this.preInputControl?.value,
        setDefaultIfValueNotPresent: 'both',
      });
    }
  }

  showFilteredOptions = false;

  _defaultOptions: Option[] = [];
  filterPreOptions: Option[] = [];
  filterPostOptions: Option[] = [];

  // @Input() isHyphenInput = true;

  @Input() set settings(value: Settings) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        this[key] = value[key];
      }
    }
  }

  ngOnInit(): void {
    this.initInputControl(this.preControlName);
    this.initBothInputControl();
  }

  initBothInputControl() {
    this.preInputControl = this.controlContainer.control.get(
      this.preControlName
    );
    this.postInputControl = this.controlContainer.control.get(
      this.postControlName
    );

    if (this.showFilteredOptions) this.initOptionsSubscription();
  }

  initOptionsSubscription() {
    const preValue = this.preInputControl.value;
    const postValue = this.postInputControl.value;

    this.setFilteredOptions({
      preValue,
      postValue,
    });

    this.preInputControl.valueChanges
      .pipe(debounceTime(200), startWith(''), pairwise())
      .subscribe(([prevValue, res]) => {
        if (res && prevValue !== res) {
          this.setFilteredOptions({
            preValue: res,
          });
        }
      });

    this.postInputControl.valueChanges
      .pipe(debounceTime(200), startWith(''), pairwise())
      .subscribe(([prevValue, res]) => {
        if (res && prevValue !== res) {
          this.setFilteredOptions({
            postValue: res,
          });
        }
      });
  }

  setFilteredOptions({
    preValue,
    postValue,
    setDefaultIfValueNotPresent,
  }: {
    preValue?: string;
    postValue?: string;
    setDefaultIfValueNotPresent?: 'pre' | 'post' | 'both';
  }) {
    const setDefaultToBoth =
      setDefaultIfValueNotPresent && setDefaultIfValueNotPresent === 'both';
    const setDefaultToPre =
      setDefaultIfValueNotPresent && setDefaultIfValueNotPresent === 'pre';
    const setDefaultToPost =
      setDefaultIfValueNotPresent && setDefaultIfValueNotPresent === 'post';

    if (postValue) {
      this.filterPreOptions = this._defaultOptions?.filter(
        (item) => item.value !== postValue
      );
    } else if (setDefaultToPre || setDefaultToBoth) {
      this.filterPreOptions = this._defaultOptions;
    }

    if (preValue) {
      this.filterPostOptions = this._defaultOptions?.filter(
        (item) => item.value !== preValue
      );
    } else if (setDefaultToPost || setDefaultToBoth) {
      this.filterPostOptions = this._defaultOptions;
    }
  }

  /**
   * Handle options setting if only of them is select type
   */
  @Input() set options(input: Option[]) {
    if (input && this.preFieldType === 'select') {
      this.preOptions = input;
    } else if (input && this.postFieldType === 'select') {
      this.postOptions = input;
    }
  }

  getProps(type: keyof PrePostType<FormProps>): FormProps {
    const newProps = this.defaultProps ? this.defaultProps[type] : {};
    return {
      ...this.props,
      ...newProps,
    };
  }
}

type InputFieldTypes = 'input' | 'select' | 'autocomplete';

type PrePostType<T> = { pre?: T; post?: T };

type Settings = {
  layout: 'default' | 'dashed' | 'pre-main' | 'post-main';
  removeSelectedOption: boolean;
};
