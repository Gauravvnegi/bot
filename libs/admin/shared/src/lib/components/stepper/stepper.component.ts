import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StepperList } from '../../types/common.type';

@Component({
  selector: 'hospitality-bot-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  @Input() stepList: StepperList[];
  @Output() onActive = new EventEmitter<number>();
  constructor() {}

  ngOnInit(): void {}

  onClick(index) {
    this.onActive.emit(index);
  }
}
