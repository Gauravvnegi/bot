import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { Country } from 'libs/web-user/shared/src/lib/data-models/countryCode';
import { FieldsetComponent } from 'libs/web-user/shared/src/lib/presentational/fieldset/fieldset.component';
import { FileUploadComponent } from 'libs/web-user/shared/src/lib/presentational/file-upload/file-upload.component';
import { InputComponent } from 'libs/web-user/shared/src/lib/presentational/input/input.component';
import { LabelComponent } from 'libs/web-user/shared/src/lib/presentational/label/label.component';
import { Temp000001RadioComponent } from 'libs/web-user/templates/temp000001/src/lib/presentational/temp000001-radio/temp000001-radio.component';
import { SelectBoxComponent } from 'libs/web-user/shared/src/lib/presentational/select-box/select-box.component';
import { Temp000001TextareaComponent } from 'libs/web-user/templates/temp000001/src/lib/presentational/temp000001-textarea/temp000001-textarea.component';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HealthDetailsService } from 'libs/web-user/shared/src/lib/services/health-details.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { UtilityService } from 'libs/web-user/shared/src/lib/services/utility.service';
import { Subscription } from 'rxjs';
import { Regex } from '../../../../../../shared/src/lib/data-models/regexConstant';
import { TranslateService } from '@ngx-translate/core';
import { SnackBarService } from 'libs/shared/material/src';

const components = {
  radio: Temp000001RadioComponent,
  input: InputComponent,
  textarea: Temp000001TextareaComponent,
  label: LabelComponent,
  fieldset: FieldsetComponent,
  select: SelectBoxComponent,
  file: FileUploadComponent,
};

@Component({
  selector: 'hospitality-bot-health-declaration',
  templateUrl: './health-declaration.component.html',
  styleUrls: ['./health-declaration.component.scss'],
})
export class HealthDeclarationComponent implements OnInit, OnDestroy {
  private $subscription: Subscription = new Subscription();
  protected healthComponents = components;
  @Output()
  addFGEvent = new EventEmitter();

  @ViewChildren('parentPanelContent', { read: ViewContainerRef })
  parentPanelContentContainer: QueryList<any>;
  @ViewChild('healthDiv', { static: false }) healthDiv: ElementRef;
  @ViewChild('nextButton') nextButton;
  @ViewChild('accordian') accordion: MatAccordion;
  @ViewChildren('panel')
  panelList: QueryList<MatExpansionPanel>;

  healthDeclarationForm: FormGroup;
  currentParentContainer: ViewContainerRef;

  containerStack = [];
  settings = [];
  keysToBeUpdated = [];
  signature: string;

  constructor(
    protected _resolver: ComponentFactoryResolver,
    protected fb: FormBuilder,
    protected _stepperService: StepperService,
    protected _healthDetailsService: HealthDetailsService,
    protected _reservationService: ReservationService,
    protected _hotelService: HotelService,
    protected _translateService: TranslateService,
    protected _snackBarService: SnackBarService,
    protected _utilityService: UtilityService
  ) {}

  ngOnInit(): void {
    this.getHealthTemplate();
  }

  ngAfterViewInit() {
    this.registerListeners();
  }

  signatureUploadFile(event) {
    if (event.file) {
      let formData = new FormData();
      formData.append('file', event.file);

      this.$subscription.add(
        this._healthDetailsService
          .uploadSignature(
            this._reservationService.reservationId,
            this._reservationService.reservationData.guestDetails.primaryGuest
              .id,
            formData
          )
          .subscribe(
            (response) => {
              this.signature = response.fileDownloadUrl;
              this._translateService
                .get('MESSAGES.SUCCESS.SIGNATURE_UPLOAD_COMPLETE')
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg, '', {
                    panelClass: 'success',
                  });
                });
              this._utilityService.$signatureUploaded.next(true);
            },
            ({ error }) => {
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg);
                });
              this._utilityService.$signatureUploaded.next(false);
            }
          )
      );
    }
  }

  createFormgroupForPanel() {
    this.healthDeclarationForm = this.fb.group({});

    for (let panel of this.settings) {
      if (panel.type === 'primary') {
        this.healthDeclarationForm.addControl('primary', new FormGroup({}));
      } else {
        if (!this.healthDeclarationForm.get('secondary')) {
          this.healthDeclarationForm.addControl('secondary', new FormArray([]));
        }
        let secondaryFA = this.healthDeclarationForm.get(
          'secondary'
        ) as FormArray;
        secondaryFA.push(new FormGroup({}));
      }
    }

    this.addFGEvent.next({
      name: 'healthDeclarationForm',
      value: this.healthDeclarationForm,
    });
  }

  registerListeners() {
    this.listenForQueryListchange();
  }

  listenForQueryListchange() {
    this.$subscription.add(
      this.parentPanelContentContainer.changes.subscribe((value) => {
        if (this.parentPanelContentContainer.length > 0) {
          this.makeComponentsDynamic();
        }
      })
    );
  }

  makeComponentsDynamic() {
    let secondaryIndex = 0;
    for (let panelIndex in this.settings) {
      if (this.settings[panelIndex].child.length) {
        let formGroup: FormGroup;
        if (this.settings[panelIndex].type === 'primary') {
          formGroup = this.healthDeclarationForm.get('primary') as FormGroup;
          this.currentParentContainer = this.parentPanelContentContainer.toArray()[
            panelIndex
          ];

          this.generateChildComponents(
            this.settings[panelIndex].child,
            this.parentPanelContentContainer.toArray()[panelIndex],
            formGroup
          );
        } else if (this.settings[panelIndex].type === 'secondary') {
          let formArray = this.healthDeclarationForm.get(
            'secondary'
          ) as FormArray;
          formGroup = formArray.at(secondaryIndex++) as FormGroup;
          this.currentParentContainer = this.parentPanelContentContainer.toArray()[
            panelIndex
          ];

          this.generateChildComponents(
            this.settings[panelIndex].child,
            this.parentPanelContentContainer.toArray()[panelIndex],
            formGroup
          );
        }
      }
    }
    this.getHealthData();
  }

  async generateChildComponents(childComponents, container, formGroup) {
    for (let childComponentndex in childComponents) {
      if (!container) {
        container = this.currentParentContainer;
      }

      this.containerStack.push(container);
      container = this.containerStack[this.containerStack.length - 1];

      const componentRef = this.generateComponent(
        childComponents[childComponentndex],
        container,
        formGroup
      );

      if (componentRef.instance.settings.type === 'fieldset') {
        container = componentRef.instance.fstContainer;
      }

      if (
        childComponents[childComponentndex].child &&
        childComponents[childComponentndex].child.length
      ) {
        this.generateChildComponents(
          [...childComponents[childComponentndex].child],
          container,
          formGroup
        );
      }
      if (componentRef.instance.settings.type === 'fieldset') {
        container = this.containerStack.pop();
      }

      this.containerStack.pop();
    }
  }

  generateComponent(config, container: ViewContainerRef, formGroup: FormGroup) {
    config = this.setConfigData(config);
    if (config.isDummy === false) {
      this.keysToBeUpdated.push(config.id);
    }
    if (config && this.healthComponents[config.component.type]) {
      const factoryComponent = this._resolver.resolveComponentFactory(
        this.healthComponents[config.component.type]
      );
      const componentObj = container.createComponent(factoryComponent) as any;

      if (componentObj) {
        formGroup.addControl(config.id, new FormControl());

        componentObj.instance.settings = {
          label: config.component.label,
          master_label: `${config.indexName}${config.indexStyle} ${config.component.master_label}`,
          options: config.component.options,
          icon: config.component.icon,
          appearance: config.component.appearance,
          type: config.component.type,
          style: config.component.style,
          mediaQuery: config.component.mediaQuery,
          validation: config.component.validation,
          required: config.component.required,
        };
        if (config.component.isOptionsOpenedChanged) {
          componentObj.instance.settings = {
            ...componentObj.instance.settings,
            isOptionsOpenedChanged: config.component.isOptionsOpenedChanged,
            optionsOpened: config.component.optionsOpened,
            optionsClosed: config.component.optionsClosed,
          };
        }
        componentObj.instance.name = config.id;
        componentObj.instance.parentForm = formGroup;
      }
      return componentObj;
    }
  }

  setConfigData(config) {
    if (config.component.label === 'Country') {
      config.component.isOptionsOpenedChanged = true;
      config.component.optionsOpened = new Country().getCountryListWithDialCode(
        [this._hotelService.hotelConfig.address.countryCode]
      );
      config.component.optionsClosed = new Country().getDialCodeList([
        this._hotelService.hotelConfig.address.countryCode,
      ]);
    } else if (config.component.label === 'Email ID') {
      config = this.setConfigValidation(config, Regex.EMAIL_REGEX);
    } else if (config.component.label === 'Phone No.') {
      config = this.setConfigValidation(config, Regex.PHONE10_REGEX);
    } else if (
      config.component.label === 'First Name' ||
      config.component.label === 'Last Name'
    ) {
      config = this.setConfigValidation(config, Regex.NAME);
    }
    return config;
  }

  setConfigValidation(config, regex) {
    config.component.validation.customValidation[0].params.pattern = regex;
    return config;
  }

  getHealthTemplate() {
    this.$subscription.add(
      this._healthDetailsService
        .getHealthTemplate(this._hotelService.healthFormId)
        .subscribe((response) => {
          this.settings = [response];
          this.createFormgroupForPanel();
        })
    );
  }

  patchHealthData(data, signatureUrl) {
    this.signature = signatureUrl;
    this.healthDeclarationForm.get('primary').patchValue(data);
  }

  getHealthData() {
    this.$subscription.add(
      this._healthDetailsService
        .getHealthData(
          this._reservationService.reservationId,
          this._reservationService.reservationData.guestDetails.primaryGuest.id
        )
        .subscribe(
          (response) => {
            if (response && response.data) {
              this.patchHealthData(response.data, response.signatureUrl);
            }
          },
          ({ error }) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
          }
        )
    );
  }

  extractDataFromHealthForm() {
    const healthFormValue = this.healthDeclarationForm.getRawValue();
    const data = {};

    this.keysToBeUpdated.forEach((key) => {
      data[key] = healthFormValue.primary[key]?.trim();
    });
    return data;
  }

  goBack() {
    this._stepperService.setIndex('back');
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
