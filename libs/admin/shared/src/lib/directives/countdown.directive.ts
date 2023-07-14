import { Directive, Input, OnInit, OnDestroy, ElementRef } from '@angular/core';

@Directive({
  selector: '[appCountdown]',
})
export class CountdownDirective implements OnInit, OnDestroy {
  @Input('appCountdown') set countdownValue(value:number){

  }
  interval: any;

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.startCountdown();
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
    }, 1000);
  }

  stopCountdown(): void {
    clearInterval(this.interval);
    // Perform any action you want when the countdown reaches zero
  }

  updateCountdownValue(): void {
    this.elementRef.nativeElement.textContent = this.countdownValue;
  }
}
