import { Directive, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCountdown]',
})
export class CountdownDirective implements OnInit, OnDestroy {
  @Input() set config(input: { value: number; type: DataType }) {
    this.countdownValue = input.value;
    if (input.type) {
      const { time, abb } = data[input.type];
      this.interval = time;
      this.abbText = abb;
    }
    this.elementRef.nativeElement.textContent = this.countdownValue + this.abbText;

    if (this.countdownValue) {
      this.startCountdown();
    } 
  }

  intervalTime = data.MIN.time;
  abbText = data.MIN.abb;

  countdownValue: number = 0;
  interval: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    // this.startCountdown();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  startCountdown(): void {
    this.interval = setInterval(() => {
      this.countdownValue--;
      if (this.countdownValue === 0) {
        this.stopCountdown();
      }
      this.updateCountdownValue();
    }, this.intervalTime);
  }

  stopCountdown(): void {
    clearInterval(this.interval);
    // Perform any action you want when the countdown reaches zero
  }

  updateCountdownValue(): void {
    this.elementRef.nativeElement.textContent =
      this.countdownValue + this.abbText;
  }
}

type DataType = 'SEC' | 'MIN';

const data: Record<
  DataType,
  {
    time: number;
    abb: 's' | 'm';
  }
> = {
  SEC: {
    time: 1000,
    abb: 's',
  },
  MIN: {
    time: 1000 * 60,
    abb: 'm',
  },
};
