import { ComponentRef, Directive, Input } from '@angular/core';
import {
  IComponentWrapperMapTemp000002,
  ITemplateTemp000002,
} from 'libs/web-user/shared/src/lib/types/temp000002';
import { StepperContentRendererDirective as BaseStepperContentRendererDirective } from 'libs/web-user/templates/temp000001/src/lib/directives/stepper-content-renderer.directive';
import { BillSummaryDetailsWrapperComponent } from '../containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component';
import { DocumentDetailsWrapperComponent } from '../containers/document-details-wrapper/document-details-wrapper.component';
import { GuestDetailsWrapperComponent } from '../containers/guest-details-wrapper/guest-details-wrapper.component';
import { HealthDeclarationWrapperComponent } from '../containers/health-declaration-wrapper/health-declaration-wrapper.component';
import { PaymentDetailsWrapperComponent } from '../containers/payment-details-wrapper/payment-details-wrapper.component';
import { StayDetailsWrapperComponent } from '../containers/stay-details-wrapper/stay-details-wrapper.component';
import { SummaryWrapperComponent } from '../containers/summary-wrapper/summary-wrapper.component';
import { Temp000002StepperComponent } from '../presentational/temp000002-stepper/temp000002-stepper.component';

const componentMapping: IComponentWrapperMapTemp000002 = {
  'stay-details-wrapper': StayDetailsWrapperComponent,
  'guest-details-wrapper': GuestDetailsWrapperComponent,
  'health-declaration-wrapper': HealthDeclarationWrapperComponent,
  'payment-details-wrapper': PaymentDetailsWrapperComponent,
  'document-details-wrapper': DocumentDetailsWrapperComponent,
  'bill-summary-details-wrapper': BillSummaryDetailsWrapperComponent,
  'summary-wrapper': SummaryWrapperComponent,
};

@Directive({ selector: '[stepper-content-renderer]' })
export class StepperContentRendererDirective extends BaseStepperContentRendererDirective {
  @Input() stepperConfig: ITemplateTemp000002;
  protected componentMapping = componentMapping;
  protected _stepperComponentObj: ComponentRef<Temp000002StepperComponent>;
  protected stepperComponent = Temp000002StepperComponent;
}
