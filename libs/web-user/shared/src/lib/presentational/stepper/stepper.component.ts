import { BreakpointObserver } from '@angular/cdk/layout';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, ContentChildren, ElementRef, EventEmitter, Inject, InjectionToken, Input, Output, QueryList, ViewChild, ViewChildren, ViewContainerRef } from '@angular/core';
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

  constructor(
    private utility: UtilityService,
    private breakpointObserver: BreakpointObserver,
    private stepperService: StepperService,
    @Inject(FORM_ERRORS) private _errors
  ) {
    super(utility, breakpointObserver, _errors);
  }

  ngOnInit() {
    super.ngOnInit();
    this.registerListeners();
  }

  registerListeners() {
    this.listenForSelectedindex();
  }

  listenForSelectedindex() {
    this.stepperService.stepperSelectedIndex$.subscribe((index) => {
      this.selectedIndex = index;
    });
  }

  ngAfterViewInit() {
    // this.initStepperLayout();
    this.isComponentRendered.next(true);
  }

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
