import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { SignaturePadModule } from 'angular2-signaturepad';
import { TextMaskModule } from 'angular2-text-mask';
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
import { PaymentCardComponent } from './presentational/payment-card/payment-card.component';
import { RadioComponent } from './presentational/radio/radio.component';
import { RatingComponent } from './presentational/rating/rating.component';
import { SelectBoxComponent } from './presentational/select-box/select-box.component';
import { SignatureCaptureWrapperComponent } from './presentational/signature-capture-wrapper/signature-capture-wrapper.component';
import { SignaturePadScribbleComponent } from './presentational/signature-pad-scribble/signature-pad-scribble.component';
import { StepperComponent } from './presentational/stepper/stepper.component';
import { TextareaComponent } from './presentational/textarea/textarea.component';

@NgModule({
  imports: [
    CommonModule,
    SharedMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    TextMaskModule,
    SignaturePadModule,
    MatTabsModule,
  ],
  exports: [
    SharedMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    StepperComponent,
    RadioComponent,
    TextareaComponent,
    SelectBoxComponent,
    InputComponent,
    FileUploadComponent,
    PaymentCardComponent,
    ButtonComponent,
    DatePickerComponent,
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
  ],
})
export class WebUserSharedModule {}
