import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';
import {
  ChangeDetectorRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  ViewContainerRef,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepperService } from 'libs/web-user/shared/src/lib/services/stepper.service';
import { TemplateLoaderService } from 'libs/web-user/shared/src/lib/services/template-loader.service';
import {
  IComponentWrapperMapTemp000001,
  ITemplateTemp000001,
} from 'libs/web-user/shared/src/lib/types/temp000001';
import { BillSummaryDetailsWrapperComponent } from '../containers/bill-summary-details-wrapper/bill-summary-details-wrapper.component';
import { DocumentsDetailsWrapperComponent } from '../containers/documents-details-wrapper/documents-details-wrapper.component';
import { GuestDetailsWrapperComponent } from '../containers/guest-details-wrapper/guest-details-wrapper.component';
import { HealthDeclarationWrapperComponent } from '../containers/health-declaration-wrapper/health-declaration-wrapper.component';
import { PaymentDetailsWrapperComponent } from '../containers/payment-details-wrapper/payment-details-wrapper.component';
import { StayDetailsWrapperComponent } from '../containers/stay-details-wrapper/stay-details-wrapper.component';
import { SummaryWrapperComponent } from '../containers/summary-wrapper/summary-wrapper.component';
import { Temp000001StepperComponent } from '../presentational/temp000001-stepper/temp000001-stepper.component';

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

const componentMapping: IComponentWrapperMapTemp000001 = {
  'stay-details-wrapper': StayDetailsWrapperComponent,
  'guest-details-wrapper': GuestDetailsWrapperComponent,
  'health-declaration-wrapper': HealthDeclarationWrapperComponent,
  'payment-details-wrapper': PaymentDetailsWrapperComponent,
  'document-details-wrapper': DocumentsDetailsWrapperComponent,
  'bill-summary-details-wrapper': BillSummaryDetailsWrapperComponent,
  'summary-wrapper': SummaryWrapperComponent,
};

@Directive({ selector: '[stepper-content-renderer]' })
export class StepperContentRendererDirective implements OnChanges {
  @Input() stepperConfig: ITemplateTemp000001;
  @Input() parentForm;
  @Input() dataToPopulate;

  protected _stepperComponentObj: ComponentRef<Temp000001StepperComponent>;
  protected stepperComponent = Temp000001StepperComponent;
  protected _isStepperRendered: boolean = false;
  protected componentMapping = componentMapping;

  constructor(
    protected _resolver: ComponentFactoryResolver,
    protected _container: ViewContainerRef,
    protected _breakpointObserver: BreakpointObserver,
    protected _templateLoadingService: TemplateLoaderService,
    protected _stepperService: StepperService,
    protected _changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges(): void {
    if (this.stepperConfig && this.parentForm && this.dataToPopulate) {
      this.renderStepper();
    }
  }

  protected renderStepper(): void {
    this.createStepperFactory();
    this.registerListeners();
  }

  protected registerListeners(): void {
    this.listenForViewChanged();
  }

  protected createStepperFactory(): void {
    const stepperFactoryComponent: ComponentFactory<any> = this._resolver.resolveComponentFactory(
      this.stepperComponent
    );

    this._stepperComponentObj = this._container.createComponent(
      stepperFactoryComponent
    );
  }

  protected listenForViewChanged(): void {
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

  protected setStepperConfig(): void {
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

  protected _listenForStepperRenderer(): void {
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

  protected createStepperContentComponents(): void {
    this._stepperComponentObj.instance.stepperContent.map(
      (item: ViewContainerRef, index: number) => {
        const componentToRender =
          this._stepperComponentObj.instance.stepperConfig.stepConfigs[index]
            .component &&
          this._stepperComponentObj.instance.stepperConfig.stepConfigs[index]
            .component.name;

        if (componentToRender) {
          const factoryComponent = this._resolver.resolveComponentFactory(
            this.componentMapping[
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

  protected addPropsToComponentInstance(
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

  protected listenForWrapperRendered(
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
