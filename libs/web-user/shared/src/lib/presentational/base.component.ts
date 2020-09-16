import {
  OnInit,
  AfterViewInit,
  OnDestroy,
  OnChanges,
  Input,
  Component,
  Output,
  EventEmitter,
  InjectionToken,
  Inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { UtilityService } from '../services/utility.service';
import { ValidatorService } from '../services/validator.service';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({ template: '' })
export class BaseComponent
  implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private _defaultValue = {
    label: '',
    disable: false,
    master_label: '',
    placeholder: '',
    value: '',
    key: '',
    required: '',
    typ: '',
    contentType: '',
    style: {
      fieldSetWrapperStyles: '',
      labelWrapperStyles: '',
      detailLabelStyles: '',
      childLabelStyles: '',
      detailValueStyles: '',
      detailWrapperStyles: '',
      detailPrefixIconStyles: '',
      detailMatIconStyles: '',
    },
    mediaQuery: '',
    icon: '',
    appearance: '',
    maskPattern: false,
    floatLabel: 'auto',
  };
  _settings;
  @Input('settings') set settings(value: {
    label?: string;
    disable?: boolean;
    checked?: boolean;
    align?: boolean;
    master_label?: string;
    placeholder?: string;
    value?: string;
    key?: string;
    required?: boolean;
    type: string;
    contentType?: string;
    floatLabel?: string;
    style?: {
      fieldSetWrapperStyles: '';
      labelWrapperStyles: '';
      childLabelStyles: '';
      detailLabelStyles: '';
      detailValueStyles: '';
      detailWrapperStyles: '';
      detailPrefixIconStyles: '';
      detailMatIconStyles: '';
    };
    mediaQuery?;
    icon?: string;
    appearance?: string;
    maskPattern?;
    options?: { key: string; value: string }[];
    validation?: { systemValidation: [] };
    handler?: {
      type: string[];
      arguments: [];
      fn_name: string;
    };
    path?: string;
    pathType?: string;
    status?: {
      code: string;
      valid: {
        prefixIcon: '';
        prefixString: '';
        linkedString: '';
        suffixIcon: '';
        suffixString: '';
      };
      invalid: {
        prefixIcon: '';
        prefixString: '';
        linkedString: '';
        suffixIcon: '';
        suffixString: '';
      };
    };
    transforms: Function[];
    valueType: string;
    repeater?: boolean;
    arrayPropPath?: string;
  }) {
    this._settings = { ...this._defaultValue, ...value };
  }

  get settings() {
    return { ...this._defaultValue, ...this._settings };
  }

  // settings: {
  //   label?: string;
  //   disable?: boolean;
  //   master_label?: string;
  //   placeholder?: string;
  //   value?: string;
  //   key?: string;
  //   required?: boolean;
  //   type: string;
  //   contentType?: string;
  //   style?: { fieldSetWrapperStyles: '' };
  //   mediaQuery?;
  //   icon?: string;
  //   appearance?: string;
  //   maskPattern?;
  //   options?: { key: string; value: string }[];
  //   validation?: { systemValidation: [] };
  // };

  @Input() parentForm: FormGroup;
  @Input() name: string;
  @Input() index: string;

  @Output() isComponentRendered = new EventEmitter();

  defaultClasses;

  errorMsg: string = '';

  constructor(
    private _utility: UtilityService,
    private _breakpointObserver: BreakpointObserver,
    private validatorService: ValidatorService
  ) {}

  ngOnChanges(): void {
    if (this.settings) {
      this.disableElement();
    }
  }

  addValidators() {
    if (this.settings && this.settings.validation && this.parentForm) {
      this.validatorService.addValidators(this);
    }
  }

  ngOnInit(): void {
    this._setupFieldStyles();
    this.disableElement();
    this._setupMediaQueries();
    if (this.settings && this.name && this.parentForm) {
      this.attachValidators();
    }
    this.addValidators();
    // console.log(
    //   'addValidators -> this.settings.validation',
    //   this.settings && this.settings.validation
    // );
  }

  attachValidators() {
    this.validatorService.errorMessageEvent.subscribe((errorMsg) => {
      // listen first then add validators
      this.errorMsg = errorMsg as string;
    });
    this.validatorService.attachValidators(this);
  }

  protected _setupMediaQueries() {
    const mediaQueries =
      this.settings &&
      this.settings.mediaQuery &&
      this.settings.mediaQuery.breakpoints &&
      Object.keys(this.settings.mediaQuery.breakpoints);

    if (mediaQueries && mediaQueries.length) {
      this._utility.setupMediaQueries(this, mediaQueries, Breakpoints);
    }
  }

  protected _setupFieldStyles() {
    this.defaultClasses = this._utility.getFieldClasses(this);
  }

  ngAfterViewInit(): void {
    this.isComponentRendered.next(true);
  }

  disableElement() {
    if (this.settings && this.parentForm && this.name) {
      if (this.settings.disable === true) {
        this.parentForm.controls[this.name].disable();
      } else if (this.settings.disable === false) {
        this.parentForm.controls[this.name].enable();
      }
    }
  }

  ngOnDestroy(): void {}
}
