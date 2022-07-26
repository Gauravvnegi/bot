import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Inject,
  InjectionToken,
  Input,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { StepperService } from '../../services/stepper.service';
import { UtilityService } from '../../services/utility.service';
import { ValidatorService } from '../../services/validator.service';
import { BaseComponent } from '../base.component';

export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
  providedIn: 'root',
  factory: () => {},
});

@Component({
  selector: 'web-user-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
    ValidatorService,
  ],
})
export class StepperComponent extends BaseComponent {
  @Input()
  stepperConfig;

  @Input() selectedIndex;

  @Output()
  selectionChange = new EventEmitter();

  @ViewChild('stepperWrapper') stepperWrapper: ElementRef;

  @ViewChildren('stepperContent', { read: ViewContainerRef })
  stepperContent: QueryList<any>;

  @ContentChildren('stepperContent', { read: ViewContainerRef })
  stepperContents: QueryList<any>;
  totalSteps: any;

  constructor(
    private utility: UtilityService,
    private breakpointObserver: BreakpointObserver,
    private stepperService: StepperService,
    @Inject(FORM_ERRORS) private _errors
  ) {
    super(utility, breakpointObserver, _errors);
  }

  ngOnInit() {
    this.totalSteps = this.stepperConfig.stepConfigs.length;
    super.ngOnInit();
    this.registerListeners();
  }

  registerListeners() {
    this.listenForSelectedindex();
  }

  toggleStepperClass() {
    let stepperElement = document.getElementsByClassName('mat-step-header');
    let horizontalLinesEle=document.getElementsByClassName('mat-stepper-horizontal-line');
     console.log("this",this.selectedIndex)
    if (this.selectedIndex === 0) {
      for (let j = 0; j < horizontalLinesEle.length; j++) {
        horizontalLinesEle[j].classList.add('disable-bar');
      }
      for (let i = 1; i < stepperElement.length; i++) {
        stepperElement[i].classList.add('step-disable');
        stepperElement[i].classList.add('disable-before')
        stepperElement[i-1].classList.add('disable-after')
      }
    }
   if(this.selectedIndex === stepperElement.length-1){
    for (let j = horizontalLinesEle.length-1; j >=0; j--) {
      horizontalLinesEle[j].classList.remove('disable-bar');
    }
    for (let i = stepperElement.length-1; i >=1; i--) {
      stepperElement[i].classList.remove('step-disable');
      stepperElement[i].classList.remove('disable-before')
      stepperElement[i-1].classList.remove('disable-after')
    }
   }
   if(this.selectedIndex > 0 && this.selectedIndex < (stepperElement.length-1)){
    for (let j = this.selectedIndex-1; j >=0; j--) {
      horizontalLinesEle[j].classList.remove('disable-bar');
    }
    for (let i = this.selectedIndex; i >=1; i--) {
      stepperElement[i].classList.remove('step-disable');
      stepperElement[i].classList.remove('disable-before')
      stepperElement[i-1].classList.remove('disable-after')
    }
    for (let j = this.selectedIndex; j < horizontalLinesEle.length; j++) {
      horizontalLinesEle[j].classList.add('disable-bar');
    }
    for (let i = this.selectedIndex+1; i < stepperElement.length; i++) {
      stepperElement[i].classList.add('step-disable');
      stepperElement[i].classList.add('disable-before')
      stepperElement[i-1].classList.add('disable-after')
    }
   }
   
  }

  listenForSelectedindex() {
    this.stepperService.stepperSelectedIndex$.subscribe((index) => {
      this.toggleStepperClass();
      this.selectedIndex = index;
    });
  }

  ngAfterViewInit() {
    // this.initStepperLayout();
    this.isComponentRendered.next(true);
    this.toggleStepperClass();
  }
  ngOnChanges() {}

  initStepperLayout() {
    //this.initStepperVariables();
  }

  // initStepperVariables() {
  //   let cssText = '';
  //   for (let stepperLayoutVariable in this.stepperConfig.layout_variables) {
  //     cssText +=
  //       stepperLayoutVariable +
  //       ':' +
  //       this.stepperConfig.layout_variables[stepperLayoutVariable] +
  //       ';';
  //   }
  //   this.elementRef.nativeElement.ownerDocument.body.style.cssText = cssText;
  // }

  onStepChange(event: any): void {
    this.stepperService.setSelectedIndex(event.selectedIndex);
    this.selectionChange.emit(event);
  }
}
