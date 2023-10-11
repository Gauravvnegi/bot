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
  @Input() stepList: MenuItem[];
  @Input() activeIndex = 0;
  @Input() readOnly = false;
  @Input() completedStyle: 'dark';
  @Output() onActive = new EventEmitter<StepperEmitType>();

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (
      this.completedStyle &&
      changes['activeIndex'] &&
      !changes.activeIndex.firstChange
    ) {
      this.stepList = this.stepList.map((item, index) => ({
        ...item,
        ...{
          styleClass:
            index < changes.activeIndex.currentValue &&
            this.completedStyle == 'dark'
              ? 'completed-step-dark'
              : 'completed',
        },
      }));
    }
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

  onActiveIndexChange(index) {
    this.onActive.emit(index);
  }
}
