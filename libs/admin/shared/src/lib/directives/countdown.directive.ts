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
    this.elementRef.nativeElement.textContent =
      this.countdownValue + ':' + this.seconds + this.abbText + ' left';

    if (this.countdownValue) {
      this.seconds = 60;
      this.startCountdown();
    }
  }

  intervalTime = data.MIN.time;
  abbText = data.MIN.abb;
  seconds = 0;

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
    this.countdownValue--;
    this.interval = setInterval(() => {
      this.seconds--;

      if (this.seconds === 0) {
        this.seconds = 60;
        this.countdownValue--;
      }

      if (this.countdownValue < 0) {
        this.elementRef.nativeElement.textContent =
          '0' + ':' + '00' + this.abbText + ' left';
        this.stopCountdown();
        return;
      }

      this.updateCountdownValue();
    }, 1000);
  }

  stopCountdown(): void {
    clearInterval(this.interval);
    // Perform any action you want when the countdown reaches zero
  }

  updateCountdownValue(): void {
    this.elementRef.nativeElement.textContent =
      this.countdownValue +
      ':' +
      (this.seconds < 10 ? '0' : '') +
      this.seconds +
      this.abbText +
      ' left';
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
