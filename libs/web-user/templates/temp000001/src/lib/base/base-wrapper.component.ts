import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';

@Component({ template: '' })
export class BaseWrapperComponent implements OnInit, AfterViewInit {
  public isWrapperRendered$: Subject<boolean> = new Subject();
  protected buttonRefs = {};

  public isRendered: boolean = false;
  protected self: this;

  ngOnInit() {}

  ngAfterViewInit() {
    this.isWrapperRendered();
  }

  isWrapperRendered() {
    this.isWrapperRendered$.next(true);
  }
}
