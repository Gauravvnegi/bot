import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'hospitality-bot-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
})
export class TimerComponent implements OnInit {
  @Input() inputMilliseconds: number = 0; // Input in milliseconds
  minutes: number = 0;
  seconds: number = 0;
  private subscription: Subscription | undefined;

  ngOnChanges(changes: SimpleChanges): void {
    if ('inputMilliseconds' in changes) {
      this.resetTimer();
      this.startTimer();
    }
  }

  ngOnInit(): void {
    // this.resetTimer();
    // this.startTimer();
  }

  private startTimer(): void {
    this.subscription = interval(1000).subscribe(() => {
      if (this.inputMilliseconds > 0) {
        this.inputMilliseconds -= 1000;
        this.minutes = Math.floor(this.inputMilliseconds / 60000);
        this.seconds = Math.floor((this.inputMilliseconds % 60000) / 1000);
      } else {
        this.resetTimer();
      }
    });
  }

  private resetTimer(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.minutes = Math.floor(this.inputMilliseconds / 60000);
    this.seconds = Math.floor((this.inputMilliseconds % 60000) / 1000);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
