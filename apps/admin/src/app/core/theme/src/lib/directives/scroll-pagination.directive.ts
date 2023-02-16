import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { map } from 'lodash';

@Directive({ selector: '[scrollPagination]' })
export class ScrollPagination implements OnDestroy {
  emitted = false;
  emittedHeight: number;
  minimumBaseDistance = 10;
  timeoutId: NodeJS.Timer;

  distance = 0;
  throttle = 3000;
  reverse = false;

  /**
   * Override default pagination settings
   */
  @Input() set scrollSettings(values: ScrollSettings) {
    map(values, (val, key) => {
      this[key] = val;
    });
  }

  /**
   * Handles addition or removal of scroll event listener
   */
  @Input() set toggleScrollListener(value: boolean) {
    if (value) this.removeEventListener();
    else this.attachEventListener();
  }

  /**
   * To trigger an event when threshold is reached
   */
  @Output() scrolled = new EventEmitter<void>();

  constructor(protected elementRef: ElementRef) {}

  // TO DO (handle Emission Failed from parent)
  // this could be the end goal () - disable and throttle will be removed
  // As, if after success - data remain same the height [emittedHeight] wont increased
  // It only needs to be set false if network calls fails
  emissionFailed() {
    this.emitted = false;
  }

  /**
   * Handle addition of event listener
   */
  attachEventListener() {
    this.elementRef.nativeElement.addEventListener('scroll', this.onScroll);
  }

  /**
   * Handle removal of event listener
   */
  removeEventListener() {
    this.elementRef.nativeElement.removeEventListener('scroll', this.onScroll);
  }

  /**
   * Handle the emission of pagination
   */
  handleEmission() {
    this.emitted = true;
    clearTimeout(this.timeoutId);
    // Enables the emission to go again
    this.timeoutId = setTimeout(() => {
      this.emitted = false;
    }, this.throttle);
  }

  /**
   * To get emission condition bases on reverse setting
   */
  canEmit({ offsetHeight, scrollTop, scrollHeight }) {
    if (this.reverse) {
      return scrollTop < this.minimumBaseDistance + this.distance;
    }

    return (
      offsetHeight + scrollTop >=
      scrollHeight - (this.minimumBaseDistance + this.distance)
    );
  }

  @HostListener('window:scroll', [])
  onScroll = () => {
    const { scrollHeight } = this.elementRef.nativeElement;

    if (this.canEmit(this.elementRef.nativeElement) && !this.emitted) {
      this.scrolled.emit();
      this.emittedHeight = scrollHeight;
      this.handleEmission();
    } else if (scrollHeight > this.emittedHeight) {
      this.emitted = false;
    }
  };

  ngOnDestroy(): void {
    this.removeEventListener();
    clearTimeout(this.timeoutId);
  }
}

type ScrollSettings = {
  distance?: number;
  throttle?: number;
  reverse?: boolean;
};
