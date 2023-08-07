import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'hospitality-bot-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @Input() stepList: MenuItem[];
  @Input() activeIndex = 0;
  @Output() onActive = new EventEmitter<{ item: MenuItem; index: number }>();
  constructor() {}

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
