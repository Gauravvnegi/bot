import {
  Component,
  Input,
  Output,
  ElementRef,
  ViewChild,
  ViewChildren,
  QueryList,
  ViewContainerRef,
  EventEmitter,
} from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'web-user-custom-stepper',
  templateUrl: './custom-stepper.component.html',
  styleUrls: ['./custom-stepper.component.scss'],
  providers: [{ provide: CdkStepper, useExisting: CustomStepperComponent }],
})
export class CustomStepperComponent extends CdkStepper {
  @Input() parentForm: FormGroup;

  @Input()
  stepperConfig;

  // @Output()
  // selectionChange = new EventEmitter();

  @ViewChild('stepperWrapper') stepperWrapper: ElementRef;

  @ViewChildren('stepperContent', { read: ViewContainerRef })
  stepperContent: QueryList<any>;

  progress = '0,100';

  // @Output() isComponentRendered = new EventEmitter();

  ngOnChanges() {
    if (this.selectedIndex > -1) {
      this.setStepperProgress();
    }
  }

  ngOnInit() {
    this.setStepperProgress();
  }

  setStepperProgress() {
    let progress =
      ((this.selectedIndex + 1) / +this.parentForm.controls.length) * 100;

    this.progress = `${progress},100`;
    document
      .querySelector('#mask')
      .setAttribute('stroke-dasharray', this.progress);
  }

  // ngAfterViewInit() {
  //   super.ngAfterViewInit();
  //   this.isComponentRendered.next(true);
  // }

  initStepperLayout() {
    //this.initStepperVariables();
  }

  onStepChange(event: any): void {
    this.selectionChange.emit(event);
  }

  onClick(index: number): void {
    this.selectedIndex = index;
  }
}
