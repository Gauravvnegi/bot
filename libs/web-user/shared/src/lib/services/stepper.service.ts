import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable()
export class StepperService {
  _selectedIndex;
  stepperSelectedIndex$ = new BehaviorSubject(0);
  totalSteps: number;
  isLastStep$: Subject<boolean> = new Subject();
  isFirstStep$: Subject<boolean> = new Subject();
  nextStepIndex$ = new BehaviorSubject(-1);

  constructor() {
    this.registerListeners();
  }

  registerListeners() {
    this.stepperSelectedIndex$.subscribe((index) => {
      this._selectedIndex = index;
    });
  }

  setSelectedIndex(index) {
    this.stepperSelectedIndex$.next(index);
    this.setNextStepIndex(index);
  }

  setNextStepIndex(number) {
    if (number > this.nextStepIndex$.value) {
      this.nextStepIndex$.next(number);
    }
  }

  setIndex(command) {
    //let commands = ['next', 'back'];
    switch (command) {
      case 'next':
        this.setSelectedIndex(this._selectedIndex + 1);
        break;
      case 'back':
        this.setSelectedIndex(
          this._selectedIndex - 1 === 0 ? 0 : this._selectedIndex - 1
        );
    }
  }

  jumpToStep(index: number) {
    this.stepperSelectedIndex$.next(index - 1 === 0 ? 0 : index - 1);
  }
}
