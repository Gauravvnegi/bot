import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

@Component({ template: '' })
export class BaseWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  public isWrapperRendered$: Subject<boolean> = new Subject();
  protected buttonRefs = {};

  public isRendered: boolean = false;
  protected self: this;
  protected $subscription = new Subscription();

  ngOnInit() {}

  ngAfterViewInit() {
    this.isWrapperRendered();
  }

  isWrapperRendered() {
    this.isWrapperRendered$.next(true);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
