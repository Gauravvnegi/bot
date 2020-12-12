import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  ViewContainerRef,
  ComponentFactory,
} from '@angular/core';
import { StepperComponent } from 'libs/web-user/shared/src/lib/presentational/stepper/stepper.component';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import { BillSummaryDetailsWrapperComponent } from '../containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component';
import { DocumentsDetailsWrapperComponent } from '../containers/documents-details-wrapper/documents-details-wrapper.component';
import { FeedbackDetailsWrapperComponent } from '../containers/feedback-details-wrapper/feedback-details-wrapper.component';
import { GuestDetailsWrapperComponent } from '../containers/guest-details-wrapper/guest-details-wrapper.component';
import { HealthDeclarationWrapperComponent } from '../containers/health-declaration-wrapper/health-declaration-wrapper.component';
import { PaymentDetailsWrapperComponent } from '../containers/payment-details-wrapper/payment-details-wrapper.component';
import { StayDetailsWrapperComponent } from '../containers/stay-details-wrapper/stay-details-wrapper.component';
import { SummaryWrapperComponent } from '../containers/summary-wrapper/summary-wrapper.component';
import { FormGroup } from '@angular/forms';

export interface IComponentMap {
  [key: string]: any;
}

export interface IComponentProps {
  formGroup: FormGroup;
  reservationData: any;
  stepperIndex: number;
  buttonConfig: IComponentButton[];
}

export interface IComponentButton {
  buttonClass: string;
  name: string;
  click: {
    fn_name: string;
  };
  settings: {
    isClickedTemplateSwitch: boolean;
    label: string;
  };
}
const componentMapping: IComponentMap = {
  'stay-details-wrapper': StayDetailsWrapperComponent,
  'guest-details-wrapper': GuestDetailsWrapperComponent,
  'health-declaration-wrapper': HealthDeclarationWrapperComponent,
  'payment-details-wrapper': PaymentDetailsWrapperComponent,
  'document-details-wrapper': DocumentsDetailsWrapperComponent,
  'feedback-details-wrapper': FeedbackDetailsWrapperComponent,
  'bill-summary-details-wrapper': BillSummaryDetailsWrapperComponent,
  'summary-wrapper': SummaryWrapperComponent,
};

@Directive({ selector: '[stepper-content-renderer]' })
export class StepperContentRendererDirective implements OnChanges {
  @Input() stepperConfig;
  @Input() parentForm;
  @Input() dataToPopulate;

  private _stepperComponentObj: ComponentRef<StepperComponent>;
  private _isStepperRendered: boolean = false;

  constructor(
    private _resolver: ComponentFactoryResolver,
    private _container: ViewContainerRef,
    private _breakpointObserver: BreakpointObserver,
    private _templateLoadingService: TemplateLoaderService,
    private _stepperService: StepperService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.stepperConfig && this.parentForm && this.dataToPopulate) {
      this.renderStepper();
    }
  }

  private renderStepper(): void {
    this.createStepperFactory();
    this.registerListeners();
  }

  private registerListeners(): void {
    this.listenForViewChanged();
  }

  private createStepperFactory(): void {
    const stepperFactoryComponent: ComponentFactory<StepperComponent> = this._resolver.resolveComponentFactory(
      StepperComponent
    );

    this._stepperComponentObj = this._container.createComponent(
      stepperFactoryComponent
    );
  }

  private listenForViewChanged(): void {
    this._breakpointObserver
      .observe([Breakpoints.XSmall])
      .subscribe((state: BreakpointState) => {
        if (this._isStepperRendered) {
          this._stepperComponentObj.destroy();
          this.createStepperFactory();
        }

        if (state.breakpoints[Breakpoints.XSmall]) {
          this.stepperConfig.position = 'vertical';
        } else {
          this.stepperConfig.position = 'horizontal';
        }

        this.setStepperConfig();

        this._listenForStepperRenderer();
      });
  }

  private setStepperConfig(): void {
    this._stepperComponentObj.instance.parentForm = this.parentForm;
    this._stepperComponentObj.instance.stepperConfig = this.stepperConfig;

    this._stepperService.setSelectedIndex(
      this.dataToPopulate.stateCompletedSteps >=
        this.stepperConfig.stepConfigs.length
        ? 0
        : this.dataToPopulate.stateCompletedSteps
    );

    this._stepperService.totalSteps =
      this.stepperConfig.stepConfigs && this.stepperConfig.stepConfigs.length;
  }

  private _listenForStepperRenderer(): void {
    this._stepperComponentObj.instance.isComponentRendered.subscribe(
      (isRendered: boolean) => {
        if (isRendered && this.dataToPopulate) {
          this._isStepperRendered = true;
          this.createStepperContentComponents();
          this.stepperConfig.position == 'vertical' &&
            this._changeDetectorRef.detectChanges();
        }
      }
    );
  }

  private createStepperContentComponents(): void {
    this._stepperComponentObj.instance.stepperContent.map(
      (item: ViewContainerRef, index: number) => {
        const componentToRender =
          this._stepperComponentObj.instance.stepperConfig.stepConfigs[index]
            .component &&
          this._stepperComponentObj.instance.stepperConfig.stepConfigs[index]
            .component.name;

        if (componentToRender) {
          const factoryComponent = this._resolver.resolveComponentFactory(
            componentMapping[
              this._stepperComponentObj.instance.stepperConfig.stepConfigs[
                index
              ].component.name
            ]
          );

          const componentObj = item.createComponent(factoryComponent);
          const props: IComponentProps = {
            formGroup: this.parentForm.at(index),
            reservationData: this.dataToPopulate,
            stepperIndex: index,
            buttonConfig: this.stepperConfig.stepConfigs[index].buttons,
          };
          this.addPropsToComponentInstance(componentObj, props, index);
        }
      }
    );
  }

  private addPropsToComponentInstance(
    componentObj: ComponentRef<any>,
    props: IComponentProps,
    index: number
  ): void {
    componentObj.instance.parentForm = props.formGroup;
    componentObj.instance.reservationData = props.reservationData;
    componentObj.instance.stepperIndex = props.stepperIndex;
    componentObj.instance.buttonConfig = props.buttonConfig;

    this.listenForWrapperRendered(componentObj, index);

    // this.stepperConfig.position == 'vertical' &&
    //   componentObj.changeDetectorRef.detectChanges();
  }

  private listenForWrapperRendered(
    componentObj: ComponentRef<any>,
    index: number
  ): void {
    try {
      componentObj.instance.isWrapperRendered$.subscribe((val) => {
        this.stepperConfig.stepConfigs.length - 1 == index &&
          this._templateLoadingService.isTemplateLoading$.next(false);
        componentObj.instance.isRendered = true;
      });
    } catch (error) {}
  }
}
