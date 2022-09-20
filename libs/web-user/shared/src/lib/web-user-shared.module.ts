import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SignaturePadModule } from 'angular2-signaturepad';
import { TextMaskModule } from 'angular2-text-mask';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { SharedMaterialModule } from '../../../../shared/material/src';
import { ButtonTemplateSwitchDirective } from './directives/button-template-switch.directive';
import { FileUploadCssDirective } from './directives/file-upload.directive';
import { ImageClassDirective } from './directives/image-class.directive';
import { LinkifyTextPipe } from './pipes/linkify-text.pipe';
import { RepeaterPipe } from './pipes/repeater.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { ButtonComponent } from './presentational/button/button.component';
import { CheckboxComponent } from './presentational/checkbox/checkbox.component';
import { CustomStepperComponent } from './presentational/custom-stepper/custom-stepper.component';
import { DatePickerComponent } from './presentational/date-picker/date-picker.component';
import { DetailComponent } from './presentational/detail/detail.component';
import { ErrorComponent } from './presentational/error/error.component';
import { FieldsetComponent } from './presentational/fieldset/fieldset.component';
import { FileUploadComponent } from './presentational/file-upload/file-upload.component';
import { InputPopupComponent } from './presentational/input-popup/input-popup.component';
import { InputComponent } from './presentational/input/input.component';
import { LabelComponent } from './presentational/label/label.component';
import { ModalComponent } from './presentational/modal/modal.component';
import { NumberInputComponent } from './presentational/number-input/number-input.component';
import { PaymentCardComponent } from './presentational/payment-card/payment-card.component';
import { PaymentMethodComponent } from './presentational/payment-method/payment-method.component';
import { PromocodeComponent } from './presentational/promocode/promocode.component';
import { RadioComponent } from './presentational/radio/radio.component';
import { RatingComponent } from './presentational/rating/rating.component';
import { SelectBoxComponent } from './presentational/select-box/select-box.component';
import { SignatureCaptureWrapperComponent } from './presentational/signature-capture-wrapper/signature-capture-wrapper.component';
import { SignaturePadScribbleComponent } from './presentational/signature-pad-scribble/signature-pad-scribble.component';
import { SlideComponent } from './presentational/slide/slide.component';
import { StepperComponent } from './presentational/stepper/stepper.component';
import { TextareaComponent } from './presentational/textarea/textarea.component';
import { TimePickerComponent } from './presentational/time-picker/time-picker.component';
import { LoaderComponent } from './presentational/loader/loader.component';
import { CheckinDateAlertComponent } from './presentational/checkin-date-alert/checkin-date-alert.component';
import { ImageHandlingComponent } from './presentational/image-handling/image-handling.component';
import { SharedImageCropperModule } from 'libs/shared/image-cropper/src/lib/shared-image-cropper.module';
import { TabGroupComponent } from './presentational/tab-group/tab-group.component';
import { BackgroundUrlPipe } from './pipes/background-url.pipe';
import { SearchSelectboxComponent } from './presentational/search-selectbox/search-selectbox.component';
import { ImageComponent } from './presentational/image/image.component';

export function HttpLoaderFactory(http: HttpClient, injector: Injector) {
  const { templateId } = injector.get('TEMPLATE_CONFIG');

  if (templateId) {
    return new MultiTranslateHttpLoader(http, [
      { prefix: './assets/i18n/core/', suffix: '.json' },
      {
        prefix: `./assets/i18n/${templateId}/`,
        suffix: '.json',
      },
    ]);
  }

  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/core/', suffix: '.json' },
  ]);
}

export interface IThemeConfig {
  templateId: string;
}

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    SignaturePadModule,
    MatTabsModule,
    NgxMaterialTimepickerModule,
    SharedImageCropperModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient, Injector],
      },
    }),
  ],
  declarations: [
    StepperComponent,
    RadioComponent,
    TextareaComponent,
    SelectBoxComponent,
    InputComponent,
    FileUploadComponent,
    ButtonComponent,
    DatePickerComponent,
    PaymentCardComponent,
    FieldsetComponent,
    LabelComponent,
    ErrorComponent,
    ModalComponent,
    RatingComponent,
    CustomStepperComponent,
    ButtonTemplateSwitchDirective,
    ImageClassDirective,
    DetailComponent,
    InputPopupComponent,
    SignaturePadScribbleComponent,
    SignatureCaptureWrapperComponent,
    CheckboxComponent,
    LinkifyTextPipe,
    SafeHtmlPipe,
    FileUploadCssDirective,
    RepeaterPipe,
    TimePickerComponent,
    SlideComponent,
    NumberInputComponent,
    PaymentMethodComponent,
    PromocodeComponent,
    LoaderComponent,
    CheckinDateAlertComponent,
    ImageHandlingComponent,
    TabGroupComponent,
    BackgroundUrlPipe,
    SearchSelectboxComponent,
    ImageComponent,
  ],
  exports: [
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    SignaturePadModule,
    MatTabsModule,
    StepperComponent,
    RadioComponent,
    TextareaComponent,
    SelectBoxComponent,
    InputComponent,
    NumberInputComponent,
    FileUploadComponent,
    PaymentCardComponent,
    ButtonComponent,
    DatePickerComponent,
    TimePickerComponent,
    TextMaskModule,
    LabelComponent,
    FieldsetComponent,
    RatingComponent,
    CustomStepperComponent,
    ButtonTemplateSwitchDirective,
    ImageClassDirective,
    DetailComponent,
    SignaturePadScribbleComponent,
    SignatureCaptureWrapperComponent,
    CheckboxComponent,
    LinkifyTextPipe,
    SafeHtmlPipe,
    FileUploadCssDirective,
    RepeaterPipe,
    SlideComponent,
    PaymentMethodComponent,
    PromocodeComponent,
    TranslateModule,
    LoaderComponent,
    CheckinDateAlertComponent,
    ImageHandlingComponent,
    TabGroupComponent,
    BackgroundUrlPipe,
    SearchSelectboxComponent,
    ImageComponent,
  ],
})
export class WebUserSharedModule {
  public static forRoot(config: IThemeConfig): ModuleWithProviders {
    return {
      ngModule: WebUserSharedModule,
      providers: [{ provide: 'TEMPLATE_CONFIG', useValue: config }],
    };
  }
}
