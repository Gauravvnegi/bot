import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedMaterialModule } from '../../../../shared/material/src';
import { StepperComponent } from './presentational/stepper/stepper.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RadioComponent } from './presentational/radio/radio.component';
import { TextareaComponent } from './presentational/textarea/textarea.component';
import { SelectBoxComponent } from './presentational/select-box/select-box.component';
import { InputComponent } from './presentational/input/input.component';
import { FileUploadComponent } from './presentational/file-upload/file-upload.component';
import { ButtonComponent } from './presentational/button/button.component';
import { DatePickerComponent } from './presentational/date-picker/date-picker.component';
import { FieldsetComponent } from './presentational/fieldset/fieldset.component';
import { PaymentCardComponent } from './presentational/payment-card/payment-card.component';
import { TextMaskModule } from 'angular2-text-mask';
import { LabelComponent } from './presentational/label/label.component';
import { ErrorComponent } from './presentational/error/error.component';
import { ModalComponent } from './presentational/modal/modal.component';
import { RatingComponent } from './presentational/rating/rating.component';
import { CustomStepperComponent } from './presentational/custom-stepper/custom-stepper.component';
import { ButtonTemplateSwitchDirective } from './directives/button-template-switch.directive';
import { DetailComponent } from './presentational/detail/detail.component';
import { ImageClassDirective } from './directives/image-class.directive';
import { InputPopupComponent } from './presentational/input-popup/input-popup.component';
import { SignaturePadModule } from 'angular2-signaturepad';
import { MatTabsModule } from '@angular/material/tabs';
import { SignaturePadScribbleComponent } from './presentational/signature-pad-scribble/signature-pad-scribble.component';
import { SignatureCaptureWrapperComponent } from './presentational/signature-capture-wrapper/signature-capture-wrapper.component';
import { LinkifyTextPipe } from './pipes/linkify-text.pipe';
import { SafeHtmlPipe } from './pipes/safe-html.pipe';
import { RepeaterPipe } from './pipes/repeater.pipe';

import { CheckboxComponent } from './presentational/checkbox/checkbox.component';
import { FileUploadCssDirective } from './directives/file-upload.directive';
import { from } from 'rxjs';

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
  // exports: [SharedMaterialModule, ReactiveFormsModule, FormsModule, StepperComponent, RadioComponent, TextareaComponent, SelectBoxComponent, InputComponent, FileUploadComponent, ButtonComponent, DatePickerComponent, PaymentCardComponent],
  // declarations: [StepperComponent,RadioComponent, TextareaComponent, SelectBoxComponent, InputComponent, FileUploadComponent, ButtonComponent, DatePickerComponent, PaymentCardComponent],
})
export class WebUserSharedModule {}
