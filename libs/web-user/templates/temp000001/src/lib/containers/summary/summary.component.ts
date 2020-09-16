import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import {
  mapper,
  FUNCTION_NAMES,
} from 'libs/web-user/shared/src/lib/utils/mapper';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { RegistrationCardComponent } from '../registration-card/registration-card.component';
import { MatDialogConfig } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements OnInit {
  config: any;
  showAppStatusForm: boolean = false;
  @Input() stepperIndex;
  context: any;
  @Output()
  addFGEvent = new EventEmitter();

  constructor(
    private _stepperService: StepperService,
    private _modal: ModalService,
    private _fb: FormBuilder
  ) {
    this.context = this;
  }

  ngOnInit(): void {
    this.getSettings();
    this.addFGEvent.next({ name: 'checkinSummary', value: this._fb.group({}) });
  }

  ngAfterViewInit() {}

  private getSettings() {
    let data = [
      {
        type: 'primary',
        child: [
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: 'Guest Details',
              value: '',
              style: {
                labelWrapperStyles: {
                  padding: '10px',
                  'background-color': '#2187d5',
                  color: 'white',
                  'border-radius': '10px',
                  'font-weight': '700',
                  'font-size': '20px',
                  margin: '20px 0px',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '',
              type: 'label',
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                fieldSetWrapperStyles: {
                  'grid-template-columns': '1fr 1fr 1fr',
                  'grid-gap': '200px',
                  padding: '0px 30px',
                  'margin-bottom': '40px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      fieldSetWrapperStyles: {
                        'grid-template-columns': 'auto',
                        padding: '0px 10px',
                        'grid-gap': '15px',
                        'margin-bottom': '40px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    fieldSetWrapperStyles: {
                      'grid-template-columns': '1fr 1fr 1fr',
                      'grid-gap': '200px',
                      padding: '0px 30px',
                      'margin-bottom': '40px',
                    },
                  },
                },
              },
              options: [],
              contentType: '',
              required: false,
              order: 0,
              key: '6',
              type: 'fieldset',
            },
            child: [
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Full Name (Primary)',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path:
                    'guestDetail.primaryGuest.nameTitle, guestDetail.primaryGuest.firstName, guestDetail.primaryGuest.lastName',
                  pathType: 'object',
                  type: 'detail',
                  appearance: '',
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Phone No.',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'phone',
                  required: false,
                  order: 0,
                  key: '',
                  path:
                    'guestDetail.primaryGuest.nationality, guestDetail.primaryGuest.mobileNumber',
                  pathType: 'object',
                  type: 'detail',
                  appearance: '',
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Email ID',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path: 'guestDetail.primaryGuest.email',
                  pathType: 'object',
                  type: 'detail',
                  appearance: '',
                },
              },
            ],
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                fieldSetWrapperStyles: {
                  'grid-template-columns': '1fr 1fr 1fr',
                  'grid-gap': '200px',
                  padding: '0px 30px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      fieldSetWrapperStyles: {
                        'grid-template-columns': 'auto',
                        padding: '0px 10px',
                        'grid-gap': '15px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    fieldSetWrapperStyles: {
                      'grid-template-columns': '1fr 1fr 1fr',
                      'grid-gap': '200px',
                      padding: '0px 30px',
                    },
                  },
                },
              },
              options: [],
              contentType: '',
              required: false,
              order: 0,
              key: '6',
              type: 'fieldset',
            },
            child: [
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Full Name (Secondary)',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path:
                    'guestDetail.secondaryGuest.$.nameTitle, guestDetail.secondaryGuest.$.firstName, guestDetail.secondaryGuest.$.lastName',
                  pathType: 'array',
                  type: 'detail',
                  appearance: '',
                  arrayPropPath: 'guestDetail.secondaryGuest.$',
                  repeater: true,
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Phone No.',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'phone',
                  required: false,
                  order: 0,
                  key: '',
                  path:
                    'guestDetail.secondaryGuest.$.nationality, guestDetail.secondaryGuest.$.mobileNumber',
                  pathType: 'array',
                  type: 'detail',
                  appearance: '',
                  arrayPropPath: 'guestDetail.secondaryGuest.$',
                  repeater: true,
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Email ID',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path: 'guestDetail.secondaryGuest.$.email',
                  pathType: 'array',
                  type: 'detail',
                  appearance: '',
                  arrayPropPath: 'guestDetail.secondaryGuest.$',
                  repeater: true,
                },
              },
            ],
          },

          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: 'Stay Details',
              value: '',
              style: {
                labelWrapperStyles: {
                  padding: '10px',
                  'background-color': '#2187d5',
                  color: 'white',
                  'border-radius': '10px',
                  'font-weight': '700',
                  'font-size': '20px',
                  margin: '20px 0px',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '1',
              type: 'label',
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                fieldSetWrapperStyles: {
                  'grid-template-columns': '1fr 1fr 1fr 1.2fr',
                  'grid-gap': '200px',
                  padding: '0px 30px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      fieldSetWrapperStyles: {
                        'grid-template-columns': 'auto',
                        padding: '0px 10px',
                        'grid-gap': '15px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    fieldSetWrapperStyles: {
                      'grid-template-columns': '1fr 1fr 1fr 1.2fr',
                      'grid-gap': '200px',
                      padding: '0px 30px',
                    },
                  },
                },
              },
              options: [],
              contentType: '',
              required: false,
              order: 0,
              key: '6',
              type: 'fieldset',
            },
            child: [
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Arrival Date',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path: 'stayDetail.arrivalTime',
                  pathType: 'object',
                  type: 'detail',
                  appearance: '',
                  valueType: 'date',
                  transforms: [
                    async function (value: any) {
                      this.value = mapper(
                        this.valueType,
                        FUNCTION_NAMES.date.dateTimeWithFormat
                      )(this.value);

                      return this;
                    },
                  ],
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Departure Date',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path: 'stayDetail.departureTime',
                  pathType: 'object',
                  type: 'detail',
                  appearance: '',
                  valueType: 'date',
                  transforms: [
                    async function (value: any) {
                      this.value = mapper(
                        this.valueType,
                        FUNCTION_NAMES.date.dateTimeWithFormat
                      )(this.value);

                      return this;
                    },
                  ],
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: 'Room Type',
                  master_label: '',
                  value: '',
                  style: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailLabelStyles: {
                      'font-size': '16px',
                      color: '#c9c9c9',
                    },
                  },
                  options: [],
                  contentType: 'text',
                  required: false,
                  order: 0,
                  key: '',
                  path: 'stayDetail.roomType',
                  pathType: 'object',
                  type: 'detail',
                  appearance: '',
                },
              },
              {
                indexName: '',
                indexStyle: '',
                component: {
                  label: '',
                  master_label: '',
                  value: '',
                  style: {
                    fieldSetWrapperStyles: {},
                  },
                  options: [],
                  contentType: '',
                  required: false,
                  order: 0,
                  key: '6',
                  type: 'fieldset',
                },
                child: [
                  {
                    indexName: '',
                    indexStyle: '',
                    component: {
                      label: 'Travelling With',
                      master_label: '',
                      value: ' ',
                      style: {
                        detailValueStyles: {
                          'font-size': '18px',
                          'font-weight': '600',
                          'margin-top': '5px',
                        },
                        detailLabelStyles: {
                          'font-size': '16px',
                          color: '#c9c9c9',
                        },
                      },
                      options: [],
                      contentType: 'text',
                      required: false,
                      order: 0,
                      key: '2',
                      type: 'detail',
                      appearance: '',
                    },
                    child: [
                      {
                        indexName: '',
                        indexStyle: '',
                        component: {
                          label: '',
                          master_label: '',
                          value: '',
                          style: {
                            fieldSetWrapperStyles: {
                              'grid-template-columns': '1fr 1fr',
                              'grid-gap': '15px',
                            },
                          },
                          options: [],
                          contentType: '',
                          required: false,
                          order: 0,
                          key: '6',
                          type: 'fieldset',
                        },
                        child: [
                          {
                            indexName: '',
                            indexStyle: '',
                            component: {
                              label: '',
                              master_label: '',
                              value: '',
                              style: {
                                detailValueStyles: {
                                  'font-size': '18px',
                                  'font-weight': '600',
                                  'margin-top': '5px',
                                },
                                detailLabelStyles: {
                                  'font-size': '16px',
                                  color: '#c9c9c9',
                                },
                              },
                              options: [],
                              contentType: 'text',
                              required: false,
                              order: 0,
                              key: '',
                              path: 'stayDetail.adultsCount',
                              pathType: 'object',
                              type: 'detail',
                              appearance: '',
                              valueType: 'string',
                              transforms: [
                                async function (value: any) {
                                  this.value = mapper(
                                    this.valueType,
                                    FUNCTION_NAMES.string.concat
                                  )(this.value, '0', 'Adults : ');

                                  return this;
                                },
                              ],
                            },
                          },
                          {
                            indexName: '',
                            indexStyle: '',
                            component: {
                              label: '',
                              master_label: '',
                              value: '',
                              style: {
                                detailValueStyles: {
                                  'font-size': '18px',
                                  'font-weight': '600',
                                  'margin-top': '5px',
                                },
                                detailLabelStyles: {
                                  'font-size': '16px',
                                  color: '#c9c9c9',
                                },
                              },
                              options: [],
                              contentType: 'text',
                              required: false,
                              order: 0,
                              key: '',
                              path: 'stayDetail.kidsCount',
                              pathType: 'object',
                              type: 'detail',
                              appearance: '',
                              valueType: 'string',
                              transforms: [
                                async function (value: any) {
                                  this.value = mapper(
                                    this.valueType,
                                    FUNCTION_NAMES.string.concat
                                  )(this.value, '0', 'Kids : ');

                                  return this;
                                },
                              ],
                            },
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },

          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: 'Documents',
              value: '',
              style: {
                labelWrapperStyles: {
                  padding: '10px',
                  'background-color': '#2187d5',
                  color: 'white',
                  'border-radius': '10px',
                  'font-weight': '700',
                  'font-size': '20px',
                  margin: '20px 0px',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '1',
              type: 'label',
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                detailValueStyles: {
                  'font-size': '18px',
                  'font-weight': '600',
                  'margin-top': '5px',
                },
                detailPrefixIconStyles: {
                  display: 'flex',
                  'align-items': 'center',
                  padding: '0px 30px',
                },
                detailMatIconStyles: {
                  'margin-right': '25px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      detailValueStyles: {
                        'font-size': '14px',
                        'margin-top': '5px',
                        'font-weight': '600',
                      },
                      detailPrefixIconStyles: {
                        display: 'flex',
                        'align-items': 'center',
                        padding: '0px 10px',
                      },
                      detailMatIconStyles: {
                        'margin-right': '12px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailPrefixIconStyles: {
                      display: 'flex',
                      'align-items': 'center',
                      padding: '0px 30px',
                    },
                    detailMatIconStyles: {
                      'margin-right': '25px',
                      height: '55px',
                      invert:
                        'invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)',
                    },
                  },
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '',
              type: 'detail',
              icon: '',
              controlName: 'documentDetail',
              status: {
                code: 'valid',
                valid: {
                  prefixIcon: 'check_circle_outline',
                  prefixString: 'Your Douments are verified successfully',
                  linkedString: '',
                  suffixIcon: '',
                  suffixString: '',
                },
                invalid: {
                  prefixIcon: 'error_outline',
                  prefixString: 'Your Douments are not verified successfully',
                  linkedString: '',
                  suffixIcon: '',
                  suffixString: '',
                },
              },
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                detailValueStyles: {
                  'font-size': '18px',
                  'font-weight': '600',
                  'margin-top': '5px',
                  'text-align': 'center',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '',
              type: 'detail',
              icon: '',
              controlName: 'documentDetail',
              status: {
                code: 'valid',
                valid: {
                  prefixIcon: '',
                  prefixString: 'Go to ',
                  linkedString: 'Documents',
                  suffixIcon: '',
                  suffixString: '',
                },
                invalid: {
                  prefixIcon: '',
                  prefixString: 'Go to ',
                  linkedString: 'Documents',
                  suffixIcon: '',
                  suffixString: '',
                },
              },
              handler: {
                type: ['click'],
                arguments: [],
                fn_name: 'goToDocumentsStep',
              },
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: 'Health Declaration Form',
              value: '',
              style: {
                labelWrapperStyles: {
                  padding: '10px',
                  'background-color': '#2187d5',
                  color: 'white',
                  'border-radius': '10px',
                  'font-weight': '700',
                  'font-size': '20px',
                  margin: '20px 0px',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '1',
              type: 'label',
            },
          },

          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                detailValueStyles: {
                  'font-size': '18px',
                  'font-weight': '600',
                  'margin-top': '5px',
                },
                detailPrefixIconStyles: {
                  display: 'flex',
                  'align-items': 'center',
                  padding: '0px 30px',
                },
                detailMatIconStyles: {
                  'margin-right': '25px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      detailValueStyles: {
                        'font-size': '14px',
                      },
                      detailPrefixIconStyles: {
                        padding: '0px 10px',
                      },
                      detailMatIconStyles: {
                        'margin-right': '12px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailPrefixIconStyles: {
                      display: 'flex',
                      'align-items': 'center',
                      padding: '0px 30px',
                    },
                    detailMatIconStyles: {
                      'margin-right': '25px',
                    },
                  },
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '',
              type: 'detail',
              icon: '',
              controlName: 'healthDeclarationForm',
              status: {
                code: 'valid',
                valid: {
                  prefixIcon: 'check_circle_outline',
                  prefixString: 'Health Declaration form has been signed',
                  linkedString: '',
                  suffixIcon: '',
                  suffixString: '',
                },
                invalid: {
                  prefixIcon: 'error_outline',
                  prefixString: 'Health Declaration form has not been signed',
                  linkedString: '',
                  suffixIcon: '',
                  suffixString: '',
                },
              },
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label:
                'Disclaimer : Health Declaration Form will be validated at Front Desk the time of Check-in. To ensure saftey of all customers, Hotel holds the right to take appropriate action as per the outcome.',
              master_label: '',
              value: ' ',
              style: {
                detailLabelStyles: {
                  'font-size': '14px',
                  color: '#c9c9c9',
                  padding: '0px 30px',
                  display: 'block',
                  'margin-top': '20px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      detailLabelStyles: {
                        padding: '0px 10px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    detailLabelStyles: {
                      'font-size': '14px',
                      color: '#c9c9c9',
                      padding: '0px 30px',
                      display: 'block',
                      'margin-top': '20px',
                    },
                  },
                },
              },
              options: [],
              contentType: 'text',
              required: false,
              order: 0,
              key: '',
              path: '',
              pathType: '',
              type: 'detail',
              appearance: '',
            },
          },

          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: 'Payment Info',
              value: '',
              style: {
                labelWrapperStyles: {
                  padding: '10px',
                  'background-color': '#2187d5',
                  color: 'white',
                  'border-radius': '10px',
                  'font-weight': '700',
                  'font-size': '20px',
                  margin: '20px 0px',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '1',
              type: 'label',
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                detailValueStyles: {
                  'font-size': '18px',
                  'font-weight': '600',
                  'margin-top': '5px',
                },
                detailPrefixIconStyles: {
                  display: 'flex',
                  'align-items': 'center',
                  padding: '0px 30px',
                },
                detailMatIconStyles: {
                  'margin-right': '25px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      detailValueStyles: {
                        'font-size': '14px',
                      },
                      detailPrefixIconStyles: {
                        padding: '0px 10px',
                      },
                      detailMatIconStyles: {
                        'margin-right': '12px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailPrefixIconStyles: {
                      display: 'flex',
                      'align-items': 'center',
                      padding: '0px 30px',
                    },
                    detailMatIconStyles: {
                      'margin-right': '25px',
                    },
                  },
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '',
              type: 'detail',
              icon: '',
              controlName: '',

              status: {
                code: 'valid',
                valid: {
                  prefixIcon: 'check_circle_outline',
                  prefixString: 'Payment Successful.',
                  linkedString: '',
                  suffixIcon: '',
                  suffixString: '',
                },
                invalid: {
                  prefixIcon: 'error_outline',
                  prefixString: 'Payment Unsuccessful.',
                  linkedString: '',
                  suffixIcon: '',
                  suffixString: '',
                },
              },
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: 'Registration Card',
              value: '',
              style: {
                labelWrapperStyles: {
                  padding: '10px',
                  'background-color': '#2187d5',
                  color: 'white',
                  'border-radius': '10px',
                  'font-weight': '700',
                  'font-size': '20px',
                  margin: '20px 0px',
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '1',
              type: 'label',
            },
          },
          {
            indexName: '',
            indexStyle: '',
            component: {
              label: '',
              master_label: '',
              value: '',
              style: {
                detailValueStyles: {
                  'font-size': '18px',
                  'font-weight': '600',
                  'margin-top': '5px',
                },
                detailPrefixIconStyles: {
                  display: 'flex',
                  'align-items': 'center',
                  padding: '0px 30px',
                },
                detailMatIconStyles: {
                  'margin-right': '25px',
                },
              },
              mediaQuery: {
                breakpoints: {
                  XSmall: {
                    styles: {
                      detailValueStyles: {
                        'font-size': '14px',
                      },
                      detailPrefixIconStyles: {
                        padding: '0px 10px',
                      },
                      detailMatIconStyles: {
                        'margin-right': '12px',
                      },
                    },
                  },
                },
                default: {
                  styles: {
                    detailValueStyles: {
                      'font-size': '18px',
                      'font-weight': '600',
                      'margin-top': '5px',
                    },
                    detailPrefixIconStyles: {
                      display: 'flex',
                      'align-items': 'center',
                      padding: '0px 30px',
                    },
                    detailMatIconStyles: {
                      'margin-right': '25px',
                    },
                  },
                },
              },
              options: '',
              contentType: 'text',
              required: true,
              order: 0,
              key: '',
              type: 'detail',
              icon: '',
              controlName: '',
              handler: {
                type: ['click'],
                arguments: [],
                fn_name: 'openRegCard',
              },
              status: {
                code: 'invalid',
                valid: {
                  prefixIcon: 'check_circle_outline',
                  prefixString: 'Verify ',
                  linkedString: 'Registration Card',
                  suffixIcon: '',
                  suffixString: '',
                },
                invalid: {
                  prefixIcon: 'error_outline',
                  prefixString: 'Verify ',
                  linkedString: 'Registration Card',
                  suffixIcon: '',
                  suffixString: '',
                },
              },
            },
          },
        ],
      },
    ];
    this.config = data;
  }

  goToDocumentsStep(event: any, ...args: any) {
    this._stepperService.jumpToStep(3);
  }

  openRegCard() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = 'modal-component';
    dialogConfig.width = '70vw';
    this._modal.openDialog(RegistrationCardComponent, dialogConfig);
  }
}
