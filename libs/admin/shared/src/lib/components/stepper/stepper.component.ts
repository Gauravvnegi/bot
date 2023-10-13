import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
export type StepperEmitType = { item: MenuItem; index: number };

@Component({
  selector: 'hospitality-bot-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  completedStep = 0;
  @Input() stepList: MenuItem[];
  @Input() activeIndex = 0;
  @Input() readOnly = false;
  @Input() completedStyle: 'dark';
  @Input() incompleteDisable = false;
  @Output() onActive = new EventEmitter<StepperEmitType>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    this.handleDisabilityStyle(changes);
    this.handleActiveStyle(changes);
    this.handleCompletedSteps(changes);
  }

  ngOnInit(): void {
    this.initCommand();
  }

  initCommand() {
    this.stepList = this.stepList.map((item, index) => ({
      ...item,
      command: (event: any) => {
        this.activeIndex = index;
        this.onActive.emit({ item: this.stepList[index], index: index });
      },
    }));
  }

  handleDisabilityStyle(changes: SimpleChanges) {
    // Firstly all step will be disabled if incomplete is disabled is true
    if (
      changes['incompleteDisable'] &&
      changes.incompleteDisable.firstChange &&
      changes.incompleteDisable.currentValue
    ) {
      this.stepList = this.stepList.map((item, index) => ({
        ...item,
        styleClass: 'disable',
      }));
    }
  }

  handleActiveStyle(changes: SimpleChanges) {
    // Active change style
    if (
      this.completedStyle &&
      changes['activeIndex'] &&
      !changes.activeIndex.firstChange
    ) {
      const isCompletedStep =
        this.completedStep < changes.activeIndex.currentValue;
      this.stepList = this.stepList.map((item, index) => ({
        ...item,
        ...{
          styleClass: `'completed '${
            this.incompleteDisable
              ? index <= changes.activeIndex.currentValue
                ? ' enable'
                : ' disable'
              : ''
          } ${
            index <= changes.activeIndex.currentValue &&
            this.completedStyle == 'dark'
              ? 'completed-step-dark'
              : ''
          }`,
        },
      }));

      // Storing previous state
      if (isCompletedStep) {
        this.completedStep = changes.activeIndex.currentValue;
      }
    }
  }

  handleCompletedSteps(change: SimpleChanges) {
    // if (
    //   change['activeIndex'] &&
    //   !change.activeIndex.firstChange &&
    //   this.completedStep < change.activeIndex.currentValue &&
    //   this.completedStyle
    // ) {
    //   this.stepList = this.stepList.map((item, index) => ({
    //     ...item,
    //     styleClass: '',
    //   }));
    // }
  }

  onActiveIndexChange(index) {
    this.onActive.emit(index);
  }
}
