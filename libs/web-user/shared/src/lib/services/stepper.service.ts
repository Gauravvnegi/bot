import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class StepperService {
  _selectedIndex;
  stepperSelectedIndex$ = new BehaviorSubject(0);
  totalSteps: number;
  isLastStep$: Subject<boolean> = new Subject();
  isFirstStep$: Subject<boolean> = new Subject();

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
  }

  setIndex(command) {
    //let commands = ['next', 'back'];
    switch (command) {
      case 'next':
        this.setSelectedIndex(this._selectedIndex + 1);
        break;
      case 'back':
        this.setSelectedIndex(
          this._selectedIndex - 1 == 0 ? 0 : this._selectedIndex - 1
        );
    }
  }

  jumpToStep(index: number) {
    this.stepperSelectedIndex$.next(index - 1 == 0 ? 0 : index - 1);
  }
}
