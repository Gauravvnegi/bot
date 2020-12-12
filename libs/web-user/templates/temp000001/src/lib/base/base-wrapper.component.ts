import {
  Component,
  OnInit,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { IComponentButton } from '../directives/stepper-content-renderer.directive';

export interface IFGEvent {
  name: string;
  value: FormGroup;
}
@Component({ template: '' })
export class BaseWrapperComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Input() stepperIndex: number;
  @Input() buttonConfig: IComponentButton[];

  protected self: this;
  protected $subscription: Subscription = new Subscription();
  protected buttonRefs = {};

  public isWrapperRendered$: Subject<boolean> = new Subject();
  public isRendered: boolean = false;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.isWrapperRendered();
  }

  isWrapperRendered(): void {
    this.isWrapperRendered$.next(true);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
